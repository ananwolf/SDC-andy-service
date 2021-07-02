import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
  let product_id = Math.floor(Math.random() * 1000000 + 1);
  let res = http.get(`http://localhost:1128/qa/questions/${product_id}`);
  // sleep(1);

  check(res, {
    "status is 200": (r) => r.status === 200
  });
};