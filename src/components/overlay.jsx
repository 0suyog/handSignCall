import styles from './OverLay.module.css';

export const OverLay = ({ children, show, toggleVisibility }) => {
    const visibleWhenhidden = { display: show ? 'none' : '' };
    const visibleWhenShow = { display: show ? '' : 'none' };

    return (
        <>
            <button
                style={visibleWhenhidden}
                onClick={(e) => {
                    toggleVisibility();
                }}>
                Join Call
            </button>
            <div
                className={styles.overlay}
                style={visibleWhenShow}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleVisibility();
                }}>
                {children}
            </div>
        </>
    );
};
