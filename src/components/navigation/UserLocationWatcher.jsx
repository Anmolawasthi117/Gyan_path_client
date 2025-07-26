import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useGeolocation from '../../hooks/useGeolocation';

/**
 * Invisible helper component.
 * - Grabs user GPS once.
 * - Fires toast warnings / success.
 * - Pushes transformed grid‑coords up via onUpdate().
 */
const UserLocationWatcher = ({ onUpdate }) => {
  const { gridCoords, insideCampus, loading, error } = useGeolocation();

  // show any hard errors (GPS blocked, etc.)
  useEffect(() => {
    if (!loading && error) toast.error(error);
  }, [loading, error]);

  // show campus status + bubble coords up
  useEffect(() => {
    if (loading) return;

    if (!insideCampus) {
      toast.error('You‘re outside the campus. Switch to manual location.');
      return;
    }

    // inside campus ✅
    toast.success('Location set inside campus ✔️');
    gridCoords && onUpdate(gridCoords);
  }, [loading, insideCampus, gridCoords, onUpdate]);

  return null; // renders nothing
};

export default UserLocationWatcher;
