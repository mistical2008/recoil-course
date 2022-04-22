import {Container, Heading, Text} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/button'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {Select} from '@chakra-ui/select'
import {Suspense, useState} from 'react'
import {atomFamily, selectorFamily, useRecoilValue, useSetRecoilState} from 'recoil'
import {getWeather} from './fakeAPI'

const userState = selectorFamily({
    key: 'user',
    get: (userId: number) => async () => {
        const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then((res) => res.json())
            .catch((err) => console.error(err))
        return userData
    },
})

const weatherRequestIdState = atomFamily({
    key: 'weatherRequestId',
    default: 0,
})

function useRefetchWeather(userId: number) {
    const setRequiestId = useSetRecoilState(weatherRequestIdState(userId))
    return () => setRequiestId((id) => id + 1)
}

const weatherState = selectorFamily({
    key: 'weather',
    get:
        (userId: number) =>
        async ({get}) => {
            get(weatherRequestIdState(userId))
            const user = get(userState(userId)) // NOTE: will await until user data is fetched
            const weather = await getWeather(user.address.city)
            return weather
        },
})

const UserWeather = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))
    const weather = useRecoilValue(weatherState(userId))
    const refetchWeather = useRefetchWeather(userId)

    if (!user) return null

    return (
        <>
            <Text>
                <b>Weather for {user.address.city}:</b> {weather} °C
            </Text>
            <Button onClick={refetchWeather}>(refetch weather)</Button>
        </>
    )
}

const UserData = ({userId}: {userId: number}) => {
    console.log({UserDataUserId: userId})
    const user = useRecoilValue(userState(userId))
    if (!user) return null

    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name:</b> {user.name}
            </Text>
            <Text>
                <b>Phone:</b> {user.phone}
            </Text>
            <Suspense fallback={<Text>Loading weather...</Text>}>
                <UserWeather userId={userId} />
            </Suspense>
        </div>
    )
}
const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                Something went wrong
            </Heading>
            <Text mb={1}>{error.message}</Text>
            <Button onClick={resetErrorBoundary}>Ok</Button>
        </div>
    )
}

export const Async = () => {
    const [userId, setUserId] = useState<number | undefined>(undefined)

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
            </Select>
            {/* NOTE: Set error boundary to prevent bloating out on errors */}
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                resetKeys={[userId]}
                onReset={() => {
                    setUserId(undefined)
                }}
            >
                {/* NOTE: Check for existence of the userId. Otherwise will blown up */}
                {userId !== undefined && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserData userId={userId} />
                    </Suspense>
                )}
            </ErrorBoundary>
        </Container>
    )
}
