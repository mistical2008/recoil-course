import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {Resizable, ResizeHandle} from 'react-resizable'
import {selector, useRecoilState, useRecoilValue} from 'recoil'
import {Handle} from './Handle'
import {elementPropertiesAtom, ElementStyle, Element, selectedElementAtom} from './Rectangle/Rectangle'

const selectedElementProperties = selector<Element | undefined>({
    key: 'selectedElementProperties',
    get: ({get}) => {
        const id = get(selectedElementAtom)
        if (id === null) return

        return get(elementPropertiesAtom(id))
    },
    set: ({get, set}, newElement) => {
        const id = get(selectedElementAtom)
        if (id === null) return null
        if (!newElement) return null

        set(elementPropertiesAtom(id), newElement)
    },
})

export const EditProperties = () => {
    const [element, setElementProps] = useRecoilState(selectedElementProperties)

    if (!element) {
        return null
    }

    const setPosition = (property: 'top' | 'left', value: number) => {
        setElementProps({
            ...element,
            style: {
                ...element.style,
                position: {
                    ...element.style.position,
                    [property]: value,
                },
            },
        })
    }

    const setSize = (property: 'width' | 'height', value: number) => {
        setElementProps({
            ...element,
            style: {
                ...element.style,
                size: {
                    ...element.style.size,
                    [property]: value,
                },
            },
        })
    }

    return (
        <Card>
            <Section heading="Position">
                <Property
                    label="Top"
                    value={element.style.position.top}
                    onChange={(top) => {
                        setPosition('top', top)
                    }}
                />
                <Property
                    label="Left"
                    value={element.style.position.left}
                    onChange={(left) => {
                        setPosition('left', left)
                    }}
                />
            </Section>
            <Section heading="Size">
                <Property
                    label="Width"
                    value={element.style.size.width}
                    onChange={(width) => {
                        setSize('width', width)
                    }}
                />
                <Property
                    label="Height"
                    value={element.style.size.height}
                    onChange={(height) => {
                        setSize('height', height)
                    }}
                />
            </Section>
        </Card>
    )
}

const Section: React.FC<{heading: string}> = ({heading, children}) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

const Property = ({label, value, onChange}: {label: string; value: number; onChange: (value: number) => void}) => {
    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => onChange(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

const Card: React.FC = ({children}) => (
    <VStack
        position="absolute"
        top="20px"
        right="20px"
        backgroundColor="white"
        padding={2}
        boxShadow="md"
        borderRadius="md"
        spacing={3}
        align="flex-start"
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </VStack>
)

const handlePlacements: ResizeHandle[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

type ResizeProps = {
    selected: boolean
    onResize: (style: ElementStyle) => void
} & ElementStyle

export const Resize: React.FC<ResizeProps> = ({selected, children, position, size, onResize}) => {
    return (
        <Resizable
            width={size.width}
            height={size.height}
            onResize={(_, {size: newSize, handle}) => {
                let topDiff = 0
                if (handle.includes('n')) {
                    topDiff = size.height - newSize.height
                }

                let leftDiff = 0
                if (handle.includes('w')) {
                    leftDiff = size.width - newSize.width
                }

                onResize({
                    size: {
                        width: Math.round(newSize.width),
                        height: Math.round(newSize.height),
                    },
                    position: {
                        top: position.top + topDiff,
                        left: position.left + leftDiff,
                    },
                })
            }}
            resizeHandles={handlePlacements}
            handle={(placement) => (
                <div>
                    <Handle placement={placement} visible={selected} />
                </div>
            )}
        >
            <div>{children}</div>
        </Resizable>
    )
}
