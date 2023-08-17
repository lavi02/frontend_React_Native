import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api_uri } from '@env';
import axios from 'axios';

export default function Photo() {
  let [nameResult, setNameResult] = useState('');
  let [accessToken, setAccessToken] = useState('');
  let [ghkrwkdwk, setGhkrwkdwk] = useState('');
  const getData = async () => {
    try {
      const accessTokenValue = await AsyncStorage.getItem('accessToken');
      const popName = await AsyncStorage.getItem('userId');

      return [accessTokenValue, popName];
    } catch (error) {
      console.error('Error getting data:', error);
      return [null, null];
    }
  };
  // 카메라 참조를 생성
  const cameraRef = useRef(null);
  // 카메라 권한 상태를 관리
  const [hasPermission, setHasPermission] = useState(null);


  useEffect(() => {
    // 컴포넌트가 마운트될 때 카메라 권한을 요청하고 상태를 업데이트
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('1:', setHasPermission);
    })();
  }, []);

  // 사진 찍기 함수
  const takePhoto = async () => {
    if (cameraRef.current) {
      // 카메라에서 사진을 찍음
      const photo = await cameraRef.current.takePictureAsync();
      // 찍은 사진을 업로드하는 함수를 호출
      uploadPhoto(photo);
      console.log('2:', photo);
    }
  };


  // 사진 업로드 함수
  const uploadPhoto = async (photo) => {
    const formData = new FormData();
    formData.append('file', {
      uri: photo.uri,
      name: 'photo' + ghkrwkdwk + '.jpg', // 파일 이름과 확장자 지정
      type: 'image/jpeg', // 이미지 파일의 타입 지정
    });
  
    try {
      const response = await fetch(api_uri + '/api/v1/upload/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer " + accessToken
        },
        body: formData,
      });
      const responseData = await response.json();
      console.log('Upload success:', responseData);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  

  if (hasPermission === null) {
    // 권한 상태가 알 수 없는 경우 빈 화면을 반환
    return <View />;
  }

  if (hasPermission === false) {
    // 권한이 없는 경우 'No access to camera' 텍스트를 반환합니다.
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 카메라 컴포넌트를 렌더링하고, 촬영 버튼을 추가 */}
      <Camera
        ref={cameraRef}
        style={{ flex: 1, aspectRatio: 4 / 3 }}
        type={Camera.Constants.Type.back}
      >
        <View style={styles.buttonContainer}>
          {/* 사진 찍기 버튼 */}
          <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
            {/* 버튼 UI */}
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
  },
});
