import axios from 'axios';

const handleSet = async (key, value) => {
  try {
    await axios.post('http://localhost:4000/set', { key, value });
  } catch (err) {
    console.error(err);
  }
};

const handleGet = async (key) => {
  try {
    const res = await axios.get('http://localhost:4000/get/' + key);
    return res.data.value;
  } catch (err) {
    console.error(err);
  }
};

export {handleGet, handleSet}