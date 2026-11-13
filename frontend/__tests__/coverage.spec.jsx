import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App smoke test', () => {
  it('renders the app heading', () => {
    render(<App />);
    expect(screen.getByText(/watchr/i)).toBeInTheDocument();
  });
});
