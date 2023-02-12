import logo from '../assets/mindvitals-icon.svg';

export const Header = () => {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '24px',
        }}>
            <img src={logo} alt="clinic-logo" />
        </header>
    );
}
