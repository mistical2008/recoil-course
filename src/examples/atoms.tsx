import {atom, useRecoilState, useRecoilValue} from 'recoil'

const darkModeAtom = atom({
    key: 'darkMode',
    default: false,
})

export const Atoms = () => {
    return (
        <div>
            <h1>Atoms</h1>
            <p>
                <DarkModeSwitch />
            </p>
            <p>
                <Button />
            </p>
        </div>
    )
}

export const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useRecoilState(darkModeAtom)
    return <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.currentTarget.checked)} />
}

export const Button = () => {
    const darkMode = useRecoilValue(darkModeAtom)
    return (
        <button
            type="button"
            style={{backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : 'black'}}
        >
            My UI button
        </button>
    )
}
