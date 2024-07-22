import { useRouter } from "next/navigation"
import KeySequenceListener from "./KeySequenceListener";
import { LOGIN_SEQUENCE } from "@/config/constants";

const LoginSequenceListener = () => {
    const router = useRouter();

    const onSequence = () => {
        router.push('/login');
    }

    return (
        <KeySequenceListener onSequence={onSequence} sequence={LOGIN_SEQUENCE} timeout={1000} />
    )
}

export default LoginSequenceListener;