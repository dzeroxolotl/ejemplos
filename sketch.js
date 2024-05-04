    const URL = "./my_model/";
    // 모델과 관련된 파일들이 위치한 경로를 저장, 이곳에 관련된 파일들이 위치한다.

    let model, webcam, labelContainer, maxPredictions;
    //모델,웹캠,레이블을 표시할 컨테이너와 최대 예측 등을 저장하는 변수들을 선언한다.

    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
    // 초기화를 담당하는 init()함수를 통해, model과 metadata의 URL을 설정한다
    //전체적으로 이 파트에선 techable machine 모델과 관련된 URL을 설정하고, 모델을 로드, 웹캠을 설정, 화면에 표시할 준비를 한다.

        model = await tmImage.load(modelURL, metadataURL);
    //Teachable machine을 로드한다.
        maxPredictions = model.getTotalClasses();
    //모델에서 예측할 클래스의 수를 가져온다.

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        window.requestAnimationFrame(loop);
        //웹캠을 설정한다. 200*200 픽셀의 크기를 가지며, 수집된 이미지를 좌우반전한다.


        document.getElementById("webcam-container").appendChild(webcam.canvas);
        //웹캠을 표시할 컨테이너를 HTML 문서에 추가한다.
        labelContainer = document.getElementById("label-container");
        //예측 결과를 표시할 레이블 컨테이너를 생성한다. 마찬가지로 이를 HTML문서에 추가한다.
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
            //레이블 컨테이너에 예측 결과를 표시할 div 요소를 추가한다
        }
    }

    async function loop() {
        webcam.update();
        //웹캠에서 이미지를 업데이트한다.
        await predict();
        //예측을 수행한다. predict() 함수를 호출하고 이 함수는 모델을 사용하여 웹캠 이미지를 예측한다. predict() 함수의 실행이 완료될 때 까지 기다린다.
        window.requestAnimationFrame(loop);
        //다음 프레임을 요청하여 루프를 반복한다. 
    }


    async function predict() {
        //teachable machine 모델을 통해 웹캠에서 이미지를 예측하는 함수.

        const prediction = await model.predict(webcam.canvas);
        //모델을 사용하여 웹캠의 현재 이미지를 예측한다.
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
        //각 클래스에 대한 예측 결과를 문자열로 만들어 레이블 컨테이너에 표시한다.
    }
