import {atom, atomFamily, useRecoilState} from 'recoil'
import {Drag} from '../Drag'
import {Resize} from '../EditProperties'
import {RectangleContainer} from './RectangleContainer'
import {RectangleInner} from './RectangleInner'

export type ElementStyle = {
    position: {top: number; left: number}
    size: {width: number; height: number}
}

export type Element = {style: ElementStyle}

export const elementPropertiesAtom = atomFamily({
    key: 'element',
    default: {
        style: {
            position: {top: 0, left: 0},
            size: {width: 100, height: 100},
        },
    },
})

export const selectedElementAtom = atom<number | null>({
    key: 'selectedElement',
    default: null,
})

export const Rectangle = ({id}: {id: number}) => {
    const [selectedElement, setSelectedElement] = useRecoilState(selectedElementAtom)
    const [element, setElement] = useRecoilState(elementPropertiesAtom(id))
    const isSelected = selectedElement === id

    return (
        <RectangleContainer
            position={element.style.position}
            size={element.style.size}
            onSelect={() => {
                setSelectedElement(id)
            }}
        >
            <Resize
                selected={isSelected}
                position={element.style.position}
                size={element.style.size}
                onResize={(style) => setElement({...element, style})}
            >
                <Drag
                    position={element.style.position}
                    onDrag={(position) => {
                        setElement({
                            style: {
                                ...element.style,
                                position,
                            },
                        })
                    }}
                >
                    <div>
                        <RectangleInner selected={id === selectedElement} />
                    </div>
                </Drag>
            </Resize>
        </RectangleContainer>
    )
}
