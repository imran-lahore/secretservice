
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
const baseUrl = 'https://secretservice-api.herokuapp.com/v1/secret'
function App() {
    const [secret, setSecret] = useState('')
    const [expire, setExpire] = useState('')
    const [hash, setHash] = useState('')
    const [secretList, setSecretList] = useState([])
    const hashValue = useRef();
    const ttl = useRef();
    useEffect(() => {
        fetch(baseUrl).then(response => response.json()).then(data => {
            setSecretList(data)
        }).catch(err => { console.log(err) });
    }, [hash])
    function RetrieveSecret(e) {
        e.preventDefault();
        const hash = hashValue.current.value;
        console.log(hash)
        const url = baseUrl + "/" + hash;
        fetch(url).then(response => response.json()).then(data => {
            setSecret(data.name)
            setExpire(data.expireAfter)
        }).catch(err => { console.log(err) });
    }

    function GenerateSecret(e) {
        e.preventDefault();
        setSecret("secret" + uuidv4())
    }

    function SaveSecret(e) {
        e.preventDefault();
        setSecret('')
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "name": secret, "expireAfter": ttl.current.value }),
        }
        fetch(baseUrl, payload).then(response => response.json())
            .then(data => {
                setHash(data.schema.uuid)
            }).catch((err) => {
                console.log(err);
            });
    }
    function isExpired(createdAt, expireAfter) {
        var t1 = new Date(createdAt);
        let date_ob = new Date();
        var tins = (date_ob - t1) / 1000;
        console.log(tins)
        if (expireAfter < tins) {
            return "true"
        }
        return "false"
    }


    return (
        <div class="container">
            <h1> <strong>Secret Service Generator Assignment Demo </strong></h1> <br />
            <label >Secret Generator</label > : <button class="btn btn-primary" onClick={GenerateSecret}>Generate Secret</button>
            <h2 class="text-success"><strong>{secret}</strong></h2> {secret && <label> TTL in sec:<input type="number" class="form-control" placeholder="TTL in secounds" ref={ttl}></input></label>}
            <button type="button" class="btn btn-primary" onClick={SaveSecret}>Save Secret</button> <br />
            <h3>{hash && <p>Hash of save secret</p>}</h3><h2 class="text-warning"><strong>{hash}</strong></h2>

            Enter Hash value to retrieve Secret : <input type="text" class="form-control" placeholder="Hash Value" ref={hashValue} />
            <button class="btn btn-info" onClick={RetrieveSecret}>Retrieve Secret</button>
            <h1>{secret}</h1> <h1>{expire}</h1>
            <div class="card border-primary mb-3">



                <h1> <strong>List of secrets with expiry details</strong></h1> <br />
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Secret</th>
                            <th scope="col">Hash</th>
                            <th scope="col">Expired</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.keys(secretList).map(secret => {
                            return (
                                <>

                                    {/* <span >secret : {secretList[secret].name} {"=>"} </span>
                  <span >hash : {secretList[secret].uuid} {"=>"} </span>
                  <span>expired : {isExpired(secretList[secret].createdAt, secretList[secret].expireAfter)}</span>
                  <br /> */}



                                    <tr class="table-default">
                                        <td>{secretList[secret].name}</td>
                                        <td>{secretList[secret].uuid}</td>
                                        <td>{isExpired(secretList[secret].createdAt, secretList[secret].expireAfter)}</td>
                                    </tr>
                                </>)
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default App;
