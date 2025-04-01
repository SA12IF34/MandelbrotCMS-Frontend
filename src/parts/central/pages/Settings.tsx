import Settings from '../components/Settings';

function SettingsPage({title}: {title: string}) {
  document.title = title;
  return (
    <div className='page settings-page'>
        <Settings />
    </div>
  )
}

export default SettingsPage;