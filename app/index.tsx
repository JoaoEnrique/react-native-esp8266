import React, { useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function HomeScreen() {
  const [isActive, setIsActive] = useState(false);


  // Função para alternar o estado no servidor
  const updateEstado = async (novoEstado: string) => {
    try {
      const response = await fetch(`seu-servidor.com/atualiza.php?novoEstado=${novoEstado}`);
      if (response.ok) {
        const data = await response.text(); // ou `await response.json()` dependendo do tipo de resposta
      } else {
        Alert.alert('Erro', `Falha ao atualizar estado: ${response.status}`);
      }
    } catch (error: any) {
      Alert.alert('Erro', `Falha na requisição: ${error?.message}`);
    }
  };

  // Função para verificar o estado do servidor
  const fetchEstado = async () => {
    try {
      const response = await fetch(`seu-servidor.com/atualiza.php`);
      if (response.ok) {
        const data = await response.text(); // Ajuste se for JSON
        
        setIsActive(data.trim() =='ligado'); // Atualiza o estado baseado na resposta
      } else {
        console.error(`Erro ao buscar estado: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`Erro ao buscar estado: ${error.message}`);
    }
  };

   // Verifica o estado no servidor a cada segundo
   useEffect(() => {
    const interval = setInterval(() => {
      fetchEstado();
    }, 1000); // 1 segundo

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  const handleToggle = () => {
    const novoEstado = isActive ? 'desligar' : 'ligar';
    setIsActive(!isActive); // Atualiza o estado local
    updateEstado(novoEstado); // Faz a requisição
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.toggle, isActive ? styles.active : styles.inactive]}
        onPress={handleToggle}
      > 
        <View
          style={[
            styles.circle,
            isActive ? styles.circleActive : styles.circleInactive,
          ]}
        />
        <Text style={styles.text}>
          {isActive ? 'Ligado' : 'Desligado'} 
        </Text>

      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  toggle: {
    width: 90,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 2,
    marginBottom: 10,
  },
  active: {
    backgroundColor: '#4CAF50',
  },
  inactive: {
    backgroundColor: '#ccc',
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  circleActive: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  circleInactive: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  text: {
    top: 65,
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    textAlign: 'center',
    width: '100%'
  },
});