import React from "react"
import PropTypes from "prop-types"
import { useWeb3Contract } from "react-moralis"
import { Button } from "web3uikit"

const ContractButton = ({ abi, address, functionName, msgValue, params, text, callback, disabled }) => {

    const {
        runContractFunction,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: address,
        msgValue: msgValue,
        functionName: functionName,
        params: params,
    })

    return (
        <Button
            icon="cube"
            onClick={async () => await runContractFunction({
                onSuccess: callback,
            })}
            text={text}
            theme="primary"
            type="button"
            disabled={isLoading || isFetching || disabled}
        />
    )
}

ContractButton.propTypes = {
    abi: PropTypes.array,
    address: PropTypes.string,
    functionName: PropTypes.string,
    msgValue: PropTypes.string,
    params: PropTypes.object,
    text: PropTypes.string,
    callback: PropTypes.func,
    disabled: PropTypes.bool,
}

export default ContractButton