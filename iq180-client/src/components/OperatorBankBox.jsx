function OperatorBankBox({symbol,index}) {
    return(
        <span
            key={'operatorBank'+(index+1)}
            id = 'operatorBankBox'
        >
            {symbol}
        </span>
    )
}

export default OperatorBankBox;