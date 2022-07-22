import React, { useEffect, useState } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button } from 'antd';
import Loader from "./Loader"
import { toast } from 'react-toastify';

import { useGetCryptosQuery } from '../services/CrpytoApi';

const Watchlist = () => {
  const { data: cryptosList, isFetching } = useGetCryptosQuery(100);
  const [cryptos, setCryptos ] = useState([]);
  
  useEffect(() => {
    const getAllItems = async () => {
      //get items from database 
      try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);
        const response = await fetch("http://localhost:5000/watchlist/getall", {
            method: "GET",
            headers: myHeaders,
        })
        const parRes = await response.json();
        var finalList = []
        parRes.forEach(element => {
          const filteredData = cryptosList?.data?.coins.filter((coin) => coin.name.toLowerCase()===(element.toLowerCase()));
          finalList.push(filteredData[0])
        })

        console.log(finalList);
        setCryptos(finalList);
  
  
    } catch (err) {
        console.log(err.message);
    }
    }

    getAllItems();

  }, [cryptosList])

  if(isFetching) return <Loader />;


  const deletefromwatchlist = async(e, name) => {
    try{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const coin_name = name;
      const body = { coin_name } ;
      const response = await fetch("http://localhost:5000/watchlist/delete", {
          method: "DELETE",
          headers: myHeaders,
          body: JSON.stringify(body)
      })

      console.log(response);

      toast.success("Sucessfully deleted " + name + " from your watchlist!");

  } catch (err) {
      console.log(err.message);

  } 
  }


  return (
    <>
    <div className="watchlist">
    <h1 style={{textAlign: "center"}}>My watchlist</h1>

      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos?.map((currency) => (
          <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.uuid}>
            <Link to={`/crypto/${currency.uuid}`}>
              <Card title={`${currency.name}`}
              extra={<img className="crypto-image" src={currency.iconUrl} alt="newim" />}
              hoverable
              >
                <p>Price: {millify(currency.price)}</p>
                <p>Market Cap: {millify(currency.marketCap)}</p>
                <p>Daily Change: {millify(currency.change)}%</p>
                <Button onClick={(e) => deletefromwatchlist(e, currency.name) }>Delete from watchlist</Button>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>


    </div>
    </>
  )
}

export default Watchlist