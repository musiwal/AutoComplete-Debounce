import React, { useState, useEffect, useRef } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Input,
  InputGroup,
  Button,
} from 'reactstrap';
import debounce from 'lodash.debounce';
import axios from 'axios';
const ITEMS_API_URL = 'https://cwbarry.pythonanywhere.com/product/';
const DEBOUNCE_DELAY = 2000;

export default function Autocomplete() {
  const [data, setData] = useState([]); //to update data from the query
  const [query, setQuery] = useState(''); //to change the query criteria

  const getData = (search) => {
    axios.get(`${ITEMS_API_URL}?search=${search}`).then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  };

  const debounceSearch = useRef(
    debounce((search) => getData(search), DEBOUNCE_DELAY)
  ).current;

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  return (
    <div className="container">
      <div class="row justify-content-md-center m-3">
        <h1>Auto Complete</h1>
      </div>
      <div class="row justify-content-md-center m-3">
        <div class="col-4">
          <h3>{query}</h3>
          <InputGroup>
            <Input
              onChange={(e) => {
                setQuery(e.target.value);
                //getData(e.target.value);
                debounceSearch(e.target.value);
              }}
              type="text"
              className="input"
              value={query}
            />
            <Button
              onClick={() => {
                setQuery('');
                setData([]);
              }}
              color="danger"
            >
              Clear!
            </Button>
          </InputGroup>
        </div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col-4">
          <ListGroup>
            {data?.map((item, index) => (
              <ListGroupItem key={index}>{item.title}</ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}
