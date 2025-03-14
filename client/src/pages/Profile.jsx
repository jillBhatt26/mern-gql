import UserInfoForm from '../components/UserInfoForm';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';

const ProfilePage = () => {
    return (
        <>
            <Nav />

            <div className="container">
                <UserInfoForm />
            </div>

            <Footer />
        </>
    );
};

export default ProfilePage;
