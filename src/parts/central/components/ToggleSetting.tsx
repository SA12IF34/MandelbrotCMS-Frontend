
interface props {
    label: string,
    setting: string,
    value: boolean,
    handleChange: (data: object) => Promise<boolean>
}

function ToggleSetting({label, setting, value, handleChange}: props) {
 
  return (
    <label htmlFor={setting} className="toggle-setting">
        <input 
            type="checkbox" 
            id={setting} 
            checked={value} 
            onChange={async (e) => {
                const newValue = e.target.checked;
                if (!(await handleChange({ [setting]: newValue }))) {
                    e.target.checked = !newValue;
                }
            }} 
        />
        <span className="setting-slider"></span>
        <span>{label}</span>
    </label>
  )
}

export default ToggleSetting