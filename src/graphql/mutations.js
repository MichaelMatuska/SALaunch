/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTicketInput = /* GraphQL */ `
  mutation CreateTicketInput(
    $input: CreateTicketInputInput!
    $condition: ModelTicketInputConditionInput
  ) {
    createTicketInput(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateTicketInput = /* GraphQL */ `
  mutation UpdateTicketInput(
    $input: UpdateTicketInputInput!
    $condition: ModelTicketInputConditionInput
  ) {
    updateTicketInput(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteTicketInput = /* GraphQL */ `
  mutation DeleteTicketInput(
    $input: DeleteTicketInputInput!
    $condition: ModelTicketInputConditionInput
  ) {
    deleteTicketInput(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
