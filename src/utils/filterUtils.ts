import { Prisma } from '@prisma/client';
import { FilterGroup, FilterCondition } from '../types/filter';
import { encode, decode } from 'base64-arraybuffer';

export function buildPrismaQuery(
  filter: FilterGroup
): Prisma.BuildWhereInput {
  return {
    [`${filter.operator ?? 'OR'}`]: filter.conditions.map(
      (condition) => {
        if ('attributeId' in condition) {
          return buildConditionQuery(condition);
        }
        return buildPrismaQuery(condition);
      }
    ),
  };
}

function buildConditionQuery(
  condition: FilterCondition
): Prisma.BuildWhereInput {
  return {
    attributes: {
      some: {
        attributeId: condition.attributeId,
        value: buildValueComparison(condition),
      },
    },
  };
}

function buildValueComparison(
  condition: FilterCondition
): Prisma.StringFilter {
  switch (condition.operator) {
    case 'equals':
      return { equals: condition.value };
    case 'contains':
      return { contains: condition.value };
    case 'gt':
      return { gt: condition.value };
    case 'lt':
      return { lt: condition.value };
    case 'gte':
      return { gte: condition.value };
    case 'lte':
      return { lte: condition.value };
    default:
      throw new Error(`Unsupported operator: ${condition.operator}`);
  }
}

export function serializeFilter(filter: FilterGroup): string {
  const json = JSON.stringify(filter);
  const buffer = new TextEncoder().encode(json);
  return encode(buffer);
}

export function deserializeFilter(filterStr: string): FilterGroup {
  const buffer = decode(filterStr);
  const json = new TextDecoder().decode(buffer);
  return JSON.parse(json);
}

export function getObject(
  theObject:
    | FilterCondition
    | FilterGroup
    | (FilterGroup | FilterCondition)[],
  id: string
): FilterCondition | FilterGroup | null {
  var result = null;
  if ('id' in theObject && theObject.id == id) {
    return theObject;
  } else if ('conditions' in theObject) {
    result = getObject(theObject?.conditions, id);
  } else if (theObject instanceof Array) {
    for (var i = 0; i < theObject.length; i++) {
      result = getObject(theObject[i], id);
      if (result) {
        break;
      }
    }
  }
  return result;
}
