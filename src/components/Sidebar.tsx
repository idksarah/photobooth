export default function Sidebar() {
    const goToHome = () => {
        window.location.href = "/";
    }

    return (
        <div className="sidebar">
            <p onClick={goToHome}>home</p>
        </div>
    )
}