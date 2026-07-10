function QuantityInput({value,onChange,min=1}){
    function handleInput(e){
        const raw=e.target.value;
        if(raw===''){
            onChange(min);
            return;
        }
        const next=Number(raw);
        if(Number.isNaN(next))return;
        onChange(next);
    }
    return(
        <div className="quantity-input">
            <button type="button" onClick={()=>onChange(value-1)} aria-label="Decrease quantity">-</button>
            <input type="number" min={min} value={value} onChange={handleInput}/>
            <button type="button" onClick={()=>onChange(value+1)} aria-label="Increase quantity">+</button>
        </div>
    );
}
export default QuantityInput;