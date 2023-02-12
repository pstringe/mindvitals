import { useContext } from 'react';
import { StateContext } from '../../App';

export const Header = () => {
    const state = useContext(StateContext);
   
    return (
        <header style={{
            marginBottom: '24px',
        }}>
            <img src={state.logo} alt="clinic-logo" />
        </header>
    );
}