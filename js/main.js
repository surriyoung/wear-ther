let x;
let y;

navigator.geolocation.getCurrentPosition((position) => {
    x = position.coords.latitude;
    y = position.coords.longitude;
    
    console.log("위도경도::::",x,y)
    
    toAddress(y,x);
    fetchAPI(Math.floor(x),Math.floor(y)); 
});

//카카오 
// REST API 키	f60858a80b95653c4ca1ce6f79967d3c
// JavaScript 키	e53772608565de049c54fdddac6601a0
let nowLocation = document.getElementById("nowLocation");
function toAddress(lon,lat){
    $.ajax({
        url : 'https://dapi.kakao.com/v2/local/geo/coord2address.json?x=' + lon +'&y=' + lat,
        type : 'GET',
        headers : {
          'Authorization' : 'KakaoAK f60858a80b95653c4ca1ce6f79967d3c',
          'Content-Type' : 'application/json;charset=UTF-8'
        },
        success : function(result) {
          let totalCount = result.meta.total_count; // 총 문서수
          console.log("주소::",result);
          if(totalCount>0){
            addr = `${result.documents[0].address.region_1depth_name} ${result.documents[0].address.region_2depth_name} ${result.documents[0].address.region_3depth_name}`
            nowLocation.innerHTML = addr;
          }
        },
        error : function(e) {
          console.log("카카오API 에러발생",e);
        }
      });

}

async function fetchAPI(x,y) {
  let serviceKey =
    "18BfP0GwIoF62a76tctQLudqLieks5GpAR%2B1lQ8dJwUEmLQrWnw3I1MYGb3JkiO8BDNfNtC9tGC3piBKMtwmgg%3D%3D";
  let base_date = "20250116"; //발표일자
  let base_time = "0500"; //발표시각
  let nx = x; //예보지점 X 좌표
  let ny = y; //예보지점 Y 좌표
  let response = await fetch(
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&numOfRows="10"&pageNo="1"&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
  ); //단기예보조회
  let data = await response.json();
  let itemList = data.response.body.items;

//   for (let i = 0; i < itemList.item.length; i++) {
//     console.log(
//       "category:::",
//       itemList.item[i].category,
//       "fcstValue::::",
//       itemList.item[i].fcstValue
//     );
//   }
  // -1시간 기온(TMP) itemList.item[0].fcstValue ℃
  let todayTmp = itemList.item[0].fcstValue;
  document.getElementById("temperature").innerHTML = `${todayTmp}˚`;
  let tempRange = document.getElementById("tmpRange");
  let wearTxt = document.getElementById("wearTxt");
  if (todayTmp <= 4) {
    tempRange.innerHTML = "4˚~";
    wearTxt.innerHTML = "패딩, 두꺼운코트, 목도리, 기모제품";
  } else if (todayTmp > 4 && todayTmp <= 8) {
    tempRange.innerHTML = "8˚~5˚";
    wearTxt.innerHTML = "코트, 가죽자켓, 히트텍, 니트, 레깅스";
  } else if (todayTmp > 8 && todayTmp <= 11) {
    tempRange.innerHTML = "11˚~9˚";
    wearTxt.innerHTML = "자켓, 트렌치코트, 야상, 니트, 청바지, 스타킹";
  } else if (todayTmp > 11 && todayTmp <= 16) {
    tempRange.innerHTML = "16˚~12˚";
    wearTxt.innerHTML = "자켓, 가디건, 야상, 스타킹, 청바지, 면바지";
  } else if (todayTmp > 16 && todayTmp <= 19) {
    tempRange.innerHTML = "19˚~17˚";
    wearTxt.innerHTML = "얇은 니트, 맨투맨, 가디건, 청바지";
  } else if (todayTmp > 19 && todayTmp <= 22) {
    tempRange.innerHTML = "22˚~20˚";
    wearTxt.innerHTML = "얇은 가디건, 긴팔, 면바지, 청바지";
  } else if (todayTmp > 22 && todayTmp <= 27) {
    tempRange.innerHTML = "27˚~23˚";
    wearTxt.innerHTML = "반팔, 얇은 셔츠, 반바지, 면바지";
  } else {
    tempRange.innerHTML = "~28˚";
    wearTxt.innerHTML = "민소매, 반팔, 반바지, 원피스";
  }
  let weatherImg = document.getElementById("weather");
  if(itemList.item[6].fcstValue == 0){
    switch (itemList.item[5].fcstValue) {
        case 1:
          weatherImg.src = "image/weather/clear.svg";
          break;
        case 2:
          weatherImg.src = "image/weather/cloudy.svg";
          break;
        case 3:
          weatherImg.src = "image/weather/overcast.svg";
          break;
        default:
          weatherImg.src = "image/weather/clear.svg";
      }
  } else {
    switch (itemList.item[6].fcstValue) {
        case 1: //비
          weatherImg.src = "image/weather/rain.svg";
          break;
        case 2: //비,눈
          weatherImg.src = "image/weather/rainsnow.svg";
          break;
        case 3: //눈
          weatherImg.src = "image/weather/snow.svg";
          break;
        case 3: //소나기
          weatherImg.src = "image/weather/shower.svg";
          break;
        default:
          weatherImg.src = "image/weather/clear.svg";
      }
  }
  
}
// - 강수형태(PTY) 코드 : 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)  itemList.item[6].fcstValue
fetchAPI();
