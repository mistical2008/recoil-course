import {atom, useRecoilValue, useSetRecoilState} from 'recoil'
import {Rectangle, selectedElementAtom} from './components/Rectangle/Rectangle'
import {EditProperties} from './components/EditProperties'
import {PageContainer} from './PageContainer'
import {Toolbar} from './Toolbar'

export const elementsAtom = atom<number[]>({
    key: 'element',
    default: [],
})

function Canvas() {
    const setSelectedElement = useSetRecoilState(selectedElementAtom)
    const elements = useRecoilValue(elementsAtom)

    return (
        <PageContainer
            onClick={() => {
                setSelectedElement(null)
            }}
        >
            <Toolbar />
            <EditProperties />
            {elements.map((id) => (
                <Rectangle key={id} id={id} />
            ))}
        </PageContainer>
    )
}

export default Canvas
