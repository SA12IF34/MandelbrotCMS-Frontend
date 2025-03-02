
import Profile from "../components/Profile";

function ProfilePage({title}: {title: string}) {
  document.title = title;
  return (
    <div className='page profile-page'>
      <Profile />
    </div>
  )
}

export default ProfilePage;