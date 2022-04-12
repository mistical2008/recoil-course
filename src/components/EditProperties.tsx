import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {Resizable, ResizeHandle} from 'react-resizable'
import {selectorFamily, useRecoilState, useRecoilValue} from 'recoil'
import {Handle} from './Handle'
import {elementPropertiesAtom, ElementStyle, selectedElementAtom} from './Rectangle/Rectangle'
import _ from 'lodash'
import produce from 'immer'

const editPropertyState = selectorFamily<number, {path: string; id: number}>({
    key: 'editPropertyState',
    get:
        ({path, id}) =>
        ({get}) => {
            const element = get(elementPropertiesAtom(id))

            return _.get(element, path)
        },
    set:
        ({path, id}) =>
        ({get, set}, newValue) => {
            const element = get(elementPropertiesAtom(id))

            const newElement = produce(element, (draft) => {
                _.set(draft, path, newValue)
            })

            set(elementPropertiesAtom(id), newElement)
        },
})

export const EditProperties = () => {
    const selectedElement = useRecoilValue(selectedElementAtom)
    if (selectedElement === null) return null

    return (
        <Card>
            <Section heading="Position">
                <Property label="Top" path="style.position.top" id={selectedElement} />
                <Property label="Left" path="style.position.left" id={selectedElement} />
            </Section>
            <Section heading="Size">
                <Property label="Width" path="style.size.width" id={selectedElement} />
                <Property label="Height" path="style.size.height" id={selectedElement} />
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

const Property = ({label, path, id}: {label: string; path: string; id: number}) => {
    const [value, setValue] = useRecoilState(editPropertyState({path, id}))

    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => setValue(value)}>
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
