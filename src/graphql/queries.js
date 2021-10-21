/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTicketInput = /* GraphQL */ `
  query GetTicketInput($id: ID!) {
    getTicketInput(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listTicketInputs = /* GraphQL */ `
  query ListTicketInputs(
    $filter: ModelTicketInputFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTicketInputs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
