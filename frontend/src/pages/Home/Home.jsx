import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logoCrimWatch from '../../assets/logoCrimWatch.png'; 
import './Home.css';
import { useNavigate } from 'react-router-dom';

const customIcon = L.icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const municipiosBaixadaSantista = ["Santos", "São Vicente", "Guarujá", "Cubatão", "Praia Grande", "Bertioga", "Mongaguá", "Itanhaém", "Peruíbe"];
const tiposDeCrime = ["Roubo", "Furto", "Tráfico de drogas", "Violência doméstica", "Homicídio", "Outros"];

const bairrosPorMunicipio = {
  "Santos": ["Centro", "Gonzaga", "Ponta da Praia", "Vila Mathias", "Embaré", "José Menino", "Boqueirão", "Aparecida", "Campo Grande", "Vila Belmiro"],
  "São Vicente": ["Centro", "Parque Bitaru", "Vila Nossa Sra. de Fátima", "Jardim Humaitá", "Samaritá", "Esplanada dos Barreiros", "Vila São Jorge", "Jardim Rio Branco"],
  "Guarujá": ["Pitangueiras", "Enseada", "Astúrias", "Vila Edna", "Santa Rosa", "Jardim Boa Esperança", "Jardim Virgínia", "Tinga"],
  "Cubatão": ["Centro", "Vila Nova", "Jardim Casqueiro", "Vila Light", "Vila São José", "Jardim Anchieta", "Vila Natal", "Areais"],
  "Praia Grande": ["Boqueirão", "Ocian", "Tupi", "Mirim", "Solemar", "Canto do Forte", "Vila Sônia", "Anhanguera"],
  "Bertioga": ["Centro", "Indaiá", "Jardim Rio da Praia", "Riviera de São Lourenço", "Boracéia", "Chácaras", "Vila Itapanhaú"],
  "Mongaguá": ["Centro", "Agenor de Campos", "Vila São Paulo", "Jardim Marina", "Jardim Itaoca", "Vila Operária", "Balneário Florida"],
  "Itanhaém": ["Centro", "Cibratel", "Suarão", "Guapurá", "Campos Elíseos", "Savoy", "Belas Artes", "Jardim Mosteiro"],
  "Peruíbe": ["Centro", "Guaraú", "Jardim Márcia", "Vila São João", "Santa Helena", "Jardim Progresso", "Praia do Una"]
};

const coordenadasMunicipios = {
  "Santos": [-23.9608, -46.3336],
  "São Vicente": [-23.9577, -46.3889],
  "Guarujá": [-23.9888, -46.2581],
  "Cubatão": [-23.8952, -46.4253],
  "Praia Grande": [-24.0084, -46.4129],
  "Bertioga": [-23.8546, -46.1397],
  "Mongaguá": [-24.0870, -46.6208],
  "Itanhaém": [-24.1833, -46.7889],
  "Peruíbe": [-24.3209, -46.9997]
};

function Home() {
  const [formData, setFormData] = useState({
    municipio: "",
    bairro: "",
    tipoCrime: "",
    localizacao: [-23.9608, -46.3336],
    descricao: ""
  });

  const [ocorrencias, setOcorrencias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtro, setFiltro] = useState({
    municipio: "",
    tipoCrime: ""
  });
  const [map, setMap] = useState(null);

  const ocorrenciasFiltradas = ocorrencias.filter(oc => {
    const matchesMunicipio = !filtro.municipio || oc.municipio === filtro.municipio;
    const matchesTipoCrime = !filtro.tipoCrime || oc.tipoCrime === filtro.tipoCrime;
    return matchesMunicipio && matchesTipoCrime;
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}, Baixada Santista, Brasil`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newLocation = [parseFloat(lat), parseFloat(lon)];
        
        setFormData(prev => ({
          ...prev,
          localizacao: newLocation
        }));
        
        if (map) map.flyTo(newLocation, 15);
      } else {
        alert("Endereço não encontrado. Tente com mais detalhes (ex: Rua XV de Novembro, 123 - Santos)");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao buscar endereço. Tente novamente.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setFormData({
      ...formData,
      localizacao: [lat, lng]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const novaOcorrencia = {
      municipio: formData.municipio,
      bairro: formData.bairro,
      tipoCrime: formData.tipoCrime,
      descricao: formData.descricao,
      localizacao: {
        type: "Point",
        coordinates: [formData.localizacao[1], formData.localizacao[0]],  // [longitude, latitude]
      },
      data: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch('http://localhost:8000/api/ocorrencias/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaOcorrencia),
      });

      if (response.ok) {
        const data = await response.json();
        setOcorrencias([...ocorrencias, data]);  // Adiciona a nova ocorrência ao estado local
        alert(`Ocorrência registrada em ${formData.bairro}, ${formData.municipio}!`);
      } else {
        alert("Erro ao registrar a ocorrência.");
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
      alert("Erro ao registrar a ocorrência.");
    }
  };

  const Navigate = useNavigate();

  const handleClick = () => {
    Navigate('/ranking');
  }

  useEffect(() => {
    if (formData.municipio && coordenadasMunicipios[formData.municipio]) {
      setFormData(prev => ({
        ...prev,
        localizacao: coordenadasMunicipios[formData.municipio]
      }));
    }
  }, [formData.municipio]);

  return (
    <div className="home">
      <div className='title-container'>
        <img src={logoCrimWatch} alt="Logo CrimWatch" className='logo' />
      </div>
      
      <div className="search-container">
        <div className="filtros">
          <select
            value={filtro.municipio}
            onChange={(e) => setFiltro({ ...filtro, municipio: e.target.value })}
          >
            <option value="">Todos os Municípios</option>
            {municipiosBaixadaSantista.map((municipio) => (
              <option key={municipio} value={municipio}>
                {municipio}
              </option>
            ))}
          </select>

          <select
            value={filtro.tipoCrime}
            onChange={(e) => setFiltro({ ...filtro, tipoCrime: e.target.value })}
          >
            <option value="">Todos os Tipos de Crime</option>
            {tiposDeCrime.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar endereço"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Município
          <select
            name="municipio"
            value={formData.municipio}
            onChange={handleInputChange}
          >
            <option value="">Selecione o Município</option>
            {municipiosBaixadaSantista.map((municipio) => (
              <option key={municipio} value={municipio}>
                {municipio}
              </option>
            ))}
          </select>
        </label>

        <label>
          Bairro
          <select
            name="bairro"
            value={formData.bairro}
            onChange={handleInputChange}
          >
            <option value="">Selecione o Bairro</option>
            {bairrosPorMunicipio[formData.municipio]?.map((bairro) => (
              <option key={bairro} value={bairro}>
                {bairro}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tipo de Crime
          <select
            name="tipoCrime"
            value={formData.tipoCrime}
            onChange={handleInputChange}
          >
            <option value="">Selecione o Tipo de Crime</option>
            {tiposDeCrime.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </label>

        <label>
          Descrição
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
          />
        </label>

        <button type="submit">Registrar Ocorrência</button>
      </form>

      <div className="map-container">
        <MapContainer
          center={formData.localizacao}
          zoom={13}
          scrollWheelZoom={false}
          whenCreated={setMap}
          onClick={handleMapClick}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={formData.localizacao} icon={customIcon}>
            <Popup>Localização da ocorrência</Popup>
          </Marker>
        </MapContainer>
      </div>

      <button onClick={handleClick}>Ver Ranking</button>
    </div>
  );
}

export default Home;
