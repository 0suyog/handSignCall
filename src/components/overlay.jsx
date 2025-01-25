import styles from './OverLay.module.css';
import styles2 from './VideoCall.module.css'
export const OverLay = ({ children, show, toggleVisibility }) => {
    const visibleWhenhidden = { display: show ? 'none' : '' };
    const visibleWhenShow = { display: show ? '' : 'none' };

    return (
        <>
            <button
                style={visibleWhenhidden}
                onClick={(e) => {
                    toggleVisibility();
                }}className={styles2.button}>
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
