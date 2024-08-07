import React from 'react';
import { useRouter } from 'next/router';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DocumentNode } from 'graphql';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { GET_TRANSPORTATIONS } from '@/api-gql/queries/transportation.queries';
import { enqueueSnackbar } from 'notistack';
import CreateRideForm from './CreateRideForm';
import { CREATE_RIDE } from '@/api-gql/mutations/ride.mutations';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));

const transportationsMock: MockedResponse[] = [
  {
    request: {
      query: GET_TRANSPORTATIONS as DocumentNode,
    },
    result: {
      data: {
        transportations: [
          { id: 1, label: 'Voiture' },
          { id: 2, label: 'Bus' },
        ],
      },
    },
  },
];

const createRideMock: MockedResponse = {
  request: {
    query: CREATE_RIDE as DocumentNode,
    variables: {
      label: 'Test Ride',
      distance: 100,
      date: '2023-01-01T00:00:00.000Z',
      transportationId: 1,
    },
  },
  result: {
    data: {
      createRide: {
        id: '1',
        label: 'Test Ride',
        distance: 100,
        date: '2023-01-01T00:00:00.000Z',
        transportation: { id: 1, label: 'Voiture' },
      },
    },
  },
};

describe('CreateRideForm', () => {
  it('renders and submits form correctly', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(
      <MockedProvider mocks={[...transportationsMock, createRideMock]}>
        <CreateRideForm />
      </MockedProvider>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Nom du trajet/i), {
      target: { value: 'Test Ride' },
    });
    fireEvent.change(screen.getByLabelText(/Distance en km/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2023-01-01' },
    });

    // Simulate mouseDown event to open the dropdown menu
    fireEvent.mouseDown(screen.getByLabelText(/Moyen de transport/i));

    // Wait for the dropdown menu to be rendered
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Select the option from the dropdown menu
    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    const voitureOption = options.find(option => option.textContent === 'Voiture');

    // Verify the option is present before clicking
    expect(voitureOption).toBeInTheDocument();

    if (voitureOption) {
      fireEvent.click(voitureOption);
    }

    fireEvent.click(screen.getByText(/Ajouter mon trajet/i));

    // Wait for assertions to be verified
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('./rides');
      expect(enqueueSnackbar).toHaveBeenCalledWith('trajet enregistré !', {
        variant: 'success',
      });
    });
  });
});
