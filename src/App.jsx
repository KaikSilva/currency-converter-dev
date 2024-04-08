import { useEffect, useRef, useState } from 'react'
import './App.css'
import currencies from "./assets/json/currencies.json"
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import axios from 'axios';
import { FaMagnifyingGlass } from "react-icons/fa6";

function App() {

  const formRef = useRef(null);

  const [currencyFrom, setCurrencyFrom] = useState(currencies[0]);
  const [currencyTo, setCurrencyTo] = useState(currencies[1]);

  const HandleConvert = () => {
    
    const inputPrimary = formRef.current.primary;
    const inputSecondary = formRef.current.secondary;

    let val = inputPrimary.value;

    if(val.length > 0 && typeof val == 'string' && (inputPrimary.value).split(" ").length > 0){
      val = (inputPrimary.value).split(" ")[1];
      val = parseFloat(val.replace(/\./g, '').replace(',', '.')).toFixed(2);

      const publicKey = "fca_live_FYYyLPDk3HrV8A8Jfmeqf9DaFXZdUTdTTqIk5426";

      console.log(currencyFrom.code) ;
      axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${publicKey}&base_currency=${currencyFrom.code}&currencies=${currencyTo.code}`)
        .then(function ({data}) {
          const currency = data.data[currencyTo.code]
          let primeirosQuatroDigitos = currency.toString().substring(0, 4);

          let total = (parseFloat(primeirosQuatroDigitos) * val).toString().substring(0, 4); 
          inputSecondary.value = `${currencyTo.format.prefix}${total}`; 
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  useEffect(() => {
    if (formRef.current) {
      HandleConvert()
    } 
  },[currencyTo, currencyFrom])

  const [OptionsCurrency, SetOptionsCurrency] = useState({
    primary: false,
    secondary: false
  })

  return (
    <>

      <div style={{marginBottom: "30px"}}>
        <h2 style={{marginBottom:"0px",fontSize: "35px"}}>
            CurrencyConverter
        </h2>
        <div style={{fontSize: "12px",marginBottom: "15px"}}>
          Desenvolvido com ❤️ por Kaik Silva
        </div>
      </div>

      

        <form ref={formRef}>
          <div className="col__InputConverter">
            <span onClick={() => SetOptionsCurrency({...OptionsCurrency, primary: !OptionsCurrency.primary})} className="flag__InputConverter">
              <img src={`/img/flags/${currencyFrom.icon}`} alt="" width="35px"/>
            </span>
            <MoneyInput  currencyOptions={currencyFrom.format} className="InputConverter" type="text" name="primary"/>
            <a className="link__InputConverter" onClick={HandleConvert}>
              <FaMagnifyingGlass />
            </a>
            <OptionsCurrencies onClose={() => SetOptionsCurrency({...OptionsCurrency, primary: false})} onChange={(item) => {setCurrencyFrom(item)}} show={OptionsCurrency.primary} current={currencyFrom} notShow={currencyTo}/>
          </div>

          <div className="col__InputConverter">
            <span onClick={() => SetOptionsCurrency({...OptionsCurrency, secondary: !OptionsCurrency.secondary})} className="flag__InputConverter">
              <img src={`/img/flags/${currencyTo.icon}`} alt="" width="35px"/>
            </span>
            <MoneyInput id="secondary" name="secondary" currencyOptions={currencyTo.format} className="InputConverter" type="text" readOnly={true}/>
            <OptionsCurrencies onClose={() => SetOptionsCurrency({...OptionsCurrency, secondary: false})} onChange={(item) => {setCurrencyTo(item)}} show={OptionsCurrency.secondary} current={currencyTo} notShow={currencyFrom} />
          </div>
        </form>
    </>
  )
}

export default App

const OptionsCurrencies = ({ show, onClose, current, notShow, onChange }) => {
  const listRef = useRef(null);

  if (!show) {
    return null;
  }

  return (
    <ul ref={listRef} className='list__currency__InputConverter'>
      {
        currencies.filter((item) => item !== current && item !== notShow).map((currency, index) => {
          return (
            <li onClick={() => onChange(currency)} className="items__list__currency__InputConverter" key={index}>
              <img src={`/img/flags/${currency.icon}`} alt={currency.code} width="30px" />
              <span>
                {currency.name}
              </span>
            </li>
          )
        })
      }
    </ul>
  )
}

const MoneyInput = (props) => {
  
  const { currencyOptions } = props;

  const defaultMaskOptions = {
    ...currencyOptions,
    allowDecimal: true,
    decimalLimit: 2, 
    integerLimit: 100, 
    allowNegative: false,
    allowLeadingZeroes: false,
  }

  const { className, readOnly, name, id} = props;
  const currencyMask = createNumberMask(defaultMaskOptions)

  return (
      <MaskedInput className={className}
                   type="text"
                   name={name}
                   id={id}
                   mask={currencyMask}
                   readOnly={readOnly}
      />
  )
}