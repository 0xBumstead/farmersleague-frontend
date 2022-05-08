import PropTypes from "prop-types"
import { Wrapper } from "./ErrorMessage.styles"

const ErrorMessage = ({ message }) => (
    <Wrapper>
        <h3>{message}</h3>
    </Wrapper>
)

ErrorMessage.propTypes = {
    message: PropTypes.string
}
export default ErrorMessage