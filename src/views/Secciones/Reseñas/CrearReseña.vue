<script>
export default {
  data() {
    return {
      resena: {
        titulo: "",
        descripcion: "",
        marca: "",
        modelo: "",
        ano: "",
        hp: "",
        puertas: "",
        video: "",
        inicial: "",
        final: ""
      },
      selectedFile: null,
      URL: "http://localhost:3000/api/resenas/crear",
      alertaMessage: "",
      carrete: [],
      id: "",
      etiquetas: {
        estudiantes: "",
        economico: "",
        rendidor: "",
        cuatro: "",
        carga: "",
        pickup: "",
        familiar: "",
        deportivo: ""
      },
      motor: {
        combustible: "",
        potencia: "",
        torque: "",
        cilindros: "",
        valvulas: "",
        alimentacion: "",
        sistema: "",
      },
      perfomance: {
        aceleracion: "",
        velocidad: "",
        rendciudad: "",
        rendruta: "",
        rendmixto: "",
      },
      chasis: {
        motor: "",
        traccion: "",
        transmision: "",
        frenos: "",
        neumaticos: "",
        suspdelantera: "",
        susptrasera: "",
        direccion: "",
      },
      capacidades: {
        largo: "",
        alto: "",
        ancho: "",
        ejes: "",
        cajuela: "",
        tanque: "",
        peso: "",
        capacidad: "",
        altura: "",
        vadeo: "",
        anguloataque: "",
        angulopartida: "",
        anguloventral: "",
        remolque: "",
        escalonamiento: "",
        inclinacion: "",
      },
      seguridad: {
        airbag: "",
        abs: "",
        distribucion: "",
        asistencia: "",
        alarma: "",
        anclaje: "",
        cinturones: "",
        otros: "",
        sensor: "",
        terceraluz: "",
        autobloqueo: "",
        controlestabilidad: "",
        controltraccion: ""
      },
      entretenimiento: {
        musica: "",
        bocinas: "",
        auxiliar: "",
        bluetooth: "",
        tablero: "",
      },
      confort: {
        aireacondicionado: "",
        asientosdelanteros: "",
        asientostraseros: "",
        cierrepuertas: "",
        computadora: "",
        espejoint: "",
        espejoext: "",
        farosanti: "",
        farosdelanteros: "",
        palancacambios: "",
        quemacocos: "",
        rines: "",
        vestiduras: "",
        velocidadcrucero: "",
        vidrios: "",
        volante: "",
        apertura: "",
        sensor: "",
        camara: "",
      }
    };
  },
  methods: {
    handleCarrete(event) {
      this.carrete = event.target.files;
    },
    changeHandler(event) {
      this.selectedFile = event.target.files[0];
    },
    async createResena() {
      const object = {
        resena: this.resena,
        motor: this.motor,
        perfomance: this.perfomance,
        chasis: this.chasis,
        capacidades: this.capacidades,
        seguridad: this.seguridad,
        entretenimiento: this.entretenimiento,
        confort: this.confort,
        etiquetas: this.etiquetas,
      }

      // Chequear si el objeto sus valores estan vacios o si los objetos dentro del object estan vacios
      
      if(Object.values(this.resena).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos de la reseña', 'error');

      if(Object.values(this.motor).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos del motor', 'error');

      if(Object.values(this.perfomance).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos de perfomance', 'error');

      if(Object.values(this.chasis).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos del chasis', 'error');

      if(Object.values(this.capacidades).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos de capacidades', 'error');

      if(Object.values(this.seguridad).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos de seguridad', 'error');

      if(Object.values(this.entretenimiento).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos de entretenimiento', 'error');

      if(Object.values(this.confort).some(item => item === "")) return this.$swal.fire('Error', 'Debes llenar todos los campos de confort', 'error');

      // Al menos debe tener una etiqueta el objeto
      const etiquetas = Object.values(this.etiquetas);

      if(Object.values(etiquetas).every(item => item === "")) return this.$swal.fire('Error', 'Debes seleccionar al menos una etiqueta', 'error');

      if(this.selectedFile == null) return this.$swal.fire('Error', 'Debes subir una imagen', 'error');

      if(this.carrete.length == 0) return this.$swal.fire('Error', 'Debes subir al menos una imagen al carrete', 'error');


      await this.axios
        .post(this.URL, object, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.alertaMessage = response.data.message;
          this.id = response.data.id;
        })
        .catch((error) => {
          this.alertaMessage = error.response.data.error;
          this.$swal
            .fire("Error", this.alertaMessage, "error")
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        });

      let portadaData = new FormData();
      portadaData.append("image", this.selectedFile);

      await this.axios
        .post(
          `http://localhost:3000/api/resenas/add/portada/${this.id}`,
          portadaData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.alertaMessage = response.data.message;
        })
        .catch((error) => {
          this.alertaMessage = error.response.data.error;
        });

      let imageData = new FormData();
      let counter = 0;
      for (let i = 0; i < this.carrete.length; i++) {
        imageData.delete("image");
        imageData.append("image", this.carrete[i]);

        await this.axios
          .post(
            `http://localhost:3000/api/resenas/add/image/${this.id}`,
            imageData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            counter++;
          })
          .catch((error) => {
            this.alertaMessage = error.response.data.error;
          });
      }

      if (counter == this.carrete.length) {
        this.$swal
          .fire("Exito", this.alertaMessage, "success")
          .then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h3>Registra una reseña</h3>
          </div>
          <div class="card-body">
            <form class="" id="loginForm" @submit.prevent="createResena">
              <div class="mb-3">
                <label for="" class="form-label">Titulo</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder=""
                  v-model="resena.titulo"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">Descripcion</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder=""
                  v-model="resena.descripcion"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">Marca</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder=""
                  v-model="resena.marca"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">Modelo</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder=""
                  v-model="resena.modelo"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">Año</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder=""
                  v-model="resena.ano"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">HP</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder=""
                  v-model="resena.hp"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">Puertas</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder=""
                  v-model="resena.puertas"
                />
              </div>
              <div class="detalles my-2">
                <div
                  class="accordion accordion-flush mx-auto"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="true"
                        aria-controls="flush-collapseOne"
                      >
                        Motor
                      </button>
                    </h2>
                    <div
                      id="flush-collapseOne"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- Some borders are removed -->
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            <label for="combustibleMotor" class="form-label">Combustible:</label>
                            <input type="text" id="combustibleMotor" class="form-control" v-model="motor.combustible">
                          </li>
                          <li class="list-group-item">
                            <label for="potenciaMotor" class="form-label">Potencia:</label>
                            <input type="text" id="potenciaMotor" class="form-control" v-model="motor.potencia">
                          </li>
                          <li class="list-group-item">
                            <label for="torque" class="form-label">Torque:</label>
                            <input type="text" id="torque" class="form-control" v-model="motor.torque">
                          </li>
                          <li class="list-group-item">
                            <label for="cilindros" class="form-label">Cilindros:</label>
                            <input type="text" id="cilindros" class="form-control" v-model="motor.cilindros">
                          </li>
                          <li class="list-group-item">
                            <label for="valvulas" class="form-label">Valvulas:</label>
                            <input type="text" id="valvulas" class="form-control" v-model="motor.valvulas">
                          </li>
                          <li class="list-group-item">
                            <label for="alimentacion" class="form-label">Alimentacion:</label>
                            <input type="text" id="alimentacion" class="form-control" v-model="motor.alimentacion">
                          </li>
                          <li class="list-group-item">
                            <label for="sistema" class="form-label">Sistema start/stop:</label>
                            <input type="text" id="sistema" class="form-control" v-model="motor.sistema">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="accordion accordion-flush mx-auto"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingTwo">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="true"
                        aria-controls="flush-collapseTwo"
                      >
                        Performance
                      </button>
                    </h2>
                    <div
                      id="flush-collapseTwo"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingTwo"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- Some borders are removed -->
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            <label for="aceleracion" class="form-label">Aceleracion 0-100km:</label>
                            <input type="number" id="aceleracion" class="form-control" v-model="perfomance.aceleracion">
                          </li>
                          <li class="list-group-item">
                            <label for="velmax" class="form-label">Velocidad Maxima:</label>
                            <input type="number" id="velmax" class="form-control" v-model="perfomance.velocidad">
                          </li>
                          <li class="list-group-item">
                            <label for="rend" class="form-label">Rendimiento en ciudad:</label>
                            <input type="text" id="rend" class="form-control" v-model="perfomance.rendciudad">
                          </li>
                          <li class="list-group-item">
                            <label for="rendruta" class="form-label">Rendimiento en ruta:</label>
                            <input type="text" id="rend" class="form-control" v-model="perfomance.rendruta">
                          </li>
                          <li class="list-group-item">
                            <label for="rendmx" class="form-label">Rendimiento míxto:</label>
                            <input type="text" id="rendmx" class="form-control" v-model="perfomance.rendmixto">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="accordion accordion-flush mx-auto"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingThree">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree"
                        aria-expanded="true"
                        aria-controls="flush-collapseThree"
                      >
                        Transmision y Chasis
                      </button>
                    </h2>
                    <div
                      id="flush-collapseThree"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingThree"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- Some borders are removed -->
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            <label for="motorPos" class="form-label">Motor (posición):</label>
                            <input type="text" id="motorPos" class="form-control" v-model="chasis.motor">
                          </li>
                          <li class="list-group-item">
                            <label for="traccion" class="form-label">Traccion:</label>
                            <input type="text" id="traccion" class="form-control" v-model="chasis.traccion">
                          </li>
                          <li class="list-group-item">
                            <label for="transmision" class="form-label">Transmisión:</label>
                            <input type="text" id="transmision" class="form-control" v-model="chasis.transmision">
                          </li>
                          <li class="list-group-item">
                            <label for="frenos" class="form-label">Frenos (Delanteros y traseros):</label>
                            <input type="text" id="frenos" class="form-control" v-model="chasis.frenos">
                          </li>
                          <li class="list-group-item">
                            <label for="neumaticos" class="form-label">Neumáticos:</label>
                            <input type="text" id="neumaticos" class="form-control" v-model="chasis.neumaticos">
                          </li>
                          <li class="list-group-item">
                            <label for="susdelantera" class="form-label">Suspensión delantera:</label>
                            <input type="text" id="susdelantera" class="form-control" v-model="chasis.suspdelantera">
                          </li>
                          <li class="list-group-item">
                            <label for="sustrasera" class="form-label">Suspensión trasera:</label>
                            <input type="text" id="sustrasera" class="form-control" v-model="chasis.susptrasera">
                          </li>
                          <li class="list-group-item">
                            <label for="dicctrasera" class="form-label">Dirección asistida:</label>
                            <input type="text" id="dicctrasera" class="form-control" v-model="chasis.direccion">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="accordion accordion-flush mx-auto"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingFour">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFour"
                        aria-expanded="true"
                        aria-controls="flush-collapseFour"
                      >
                        Medidas y capacidades
                      </button>
                    </h2>
                    <div
                      id="flush-collapseFour"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingFour"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- Some borders are removed -->
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            <label for="largo" class="form-label">Largo:</label>
                            <input type="int" id="largo" class="form-control" v-model="capacidades.largo">
                          </li>
                          <li class="list-group-item">
                            <label for="alto" class="form-label">Alto:</label>
                            <input type="int" id="alto" class="form-control" v-model="capacidades.alto">
                          </li>
                          <li class="list-group-item">
                            <label for="ancho" class="form-label">Ancho:</label>
                            <input type="int" id="ancho" class="form-control" v-model="capacidades.ancho">
                          </li>
                          <li class="list-group-item">
                            <label for="distanciaejes" class="form-label">Distancia entre ejes:</label>
                            <input type="int" id="distanciaejes" class="form-control" v-model="capacidades.ejes">
                          </li>
                          <li class="list-group-item">
                            <label for="cajuela" class="form-label">Cajuela:</label>
                            <input type="text" id="cajuela" class="form-control"  v-model="capacidades.cajuela">
                          </li>
                          <li class="list-group-item">
                            <label for="tanquecombustible" class="form-label">Tanque de combustible:</label>
                            <input type="text" id="tanquecombustible" class="form-control"  v-model="capacidades.tanque">
                          </li>
                          <li class="list-group-item">
                            <label for="peso" class="form-label">Peso:</label>
                            <input type="text" id="peso" class="form-control"  v-model="capacidades.peso">
                          </li>
                          <li class="list-group-item">
                            <label for="capacidadcarga" class="form-label">Capacidad de carga:</label>
                            <input type="text" id="capacidadcarga" class="form-control"  v-model="capacidades.capacidad">
                          </li>
                          <li class="list-group-item">
                            <label for="alturapiso" class="form-label">Altura de piso:</label>
                            <input type="text" id="alturapiso" class="form-control"  v-model="capacidades.altura">
                          </li>
                          <li class="list-group-item">
                            <label for="capacidadvadeo" class="form-label">Capacidad de vadeo:</label>
                            <input type="text" id="capacidadvadeo" class="form-control"  v-model="capacidades.vadeo">
                          </li>
                          <li class="list-group-item">
                            <label for="anguloataque" class="form-label">Ángulo de ataque:</label>
                            <input type="text" id="anguloataque" class="form-control"  v-model="capacidades.anguloataque">
                          </li>
                          <li class="list-group-item">
                            <label for="angulopartida" class="form-label">Ángulo de partida:</label>
                            <input type="text" id="angulopartida" class="form-control" v-model="capacidades.angulopartida">
                          </li>
                          <li class="list-group-item">
                            <label for="anguloventral" class="form-label">Ángulo ventral:</label>
                            <input type="text" id="anguloventral" class="form-control"  v-model="capacidades.anguloventral">
                          </li>
                          <li class="list-group-item">
                            <label for="remolque" class="form-label">Remolque con frenos:</label>
                            <input type="text" id="remolque" class="form-control"  v-model="capacidades.remolque">
                          </li>
                          <li class="list-group-item">
                            <label for="escalonamiento" class="form-label">Escalonamiento vertical:</label>
                            <input type="text" id="escalonamiento" class="form-control"  v-model="capacidades.escalonamiento">
                          </li>
                          <li class="list-group-item">
                            <label for="inclinacion" class="form-label">Inclinacion lateral:</label>
                            <input type="text" id="inclinacion" class="form-control"  v-model="capacidades.inclinacion">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="accordion accordion-flush mx-auto"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingFour">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFive"
                        aria-expanded="true"
                        aria-controls="flush-collapseFive"
                      >
                        Seguridad
                      </button>
                    </h2>
                    <div
                      id="flush-collapseFive"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingFive"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- Some borders are removed -->
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            <label for="airbag" class="form-label">Airbag:</label>
                            <input type="text" id="airbag" class="form-control"  v-model="seguridad.airbag">
                          </li>
                          <li class="list-group-item">
                            <label for="abs" class="form-label">ABS:</label>
                            <input type="text" id="abs" class="form-control"  v-model="seguridad.abs">
                          </li>
                          <li class="list-group-item">
                            <label for="distelec" class="form-label">Distribucion Electronica de Frenado:</label>
                            <input type="text" id="distelec" class="form-control"  v-model="seguridad.distribucion">
                          </li>
                          <li class="list-group-item">
                            <label for="asistfrenada" class="form-label">Asistencia en frenada de emergencia:</label>
                            <input type="text" id="asistfrenada" class="form-control"  v-model="seguridad.asistencia">
                          </li>
                          <li class="list-group-item">
                            <label for="alarma" class="form-label">Alarma e inmovilizador de motor:</label>
                            <input type="text" id="alarma" class="form-control" v-model="seguridad.alarma">
                          </li>
                          <li class="list-group-item">
                            <label for="anclaje" class="form-label">Anclaje para asientos infantiles:</label>
                            <input type="text" id="anclaje" class="form-control" v-model="seguridad.anclaje">
                          </li>
                          <li class="list-group-item">
                            <label for="cinturones" class="form-label">Cinturones de seguridad:</label>
                            <input type="text" id="cinturones" class="form-control"  v-model="seguridad.cinturones">
                          </li>
                          <li class="list-group-item">
                            <label for="otros" class="form-label">Otros (especificar):</label>
                            <input type="text" id="otros" class="form-control" v-model="seguridad.otros">
                          </li>
                          <li class="list-group-item">
                            <label for="sensorlluvia" class="form-label">Sensor de lluvia:</label>
                            <input type="text" id="sensorlluvia" class="form-control"  v-model="seguridad.sensor">
                          </li>
                          <li class="list-group-item">
                            <label for="terceraluz" class="form-label">Tercera luz de stop:</label>
                            <input type="text" id="terceraluz" class="form-control"  v-model="seguridad.terceraluz">
                          </li>
                          <li class="list-group-item">
                            <label for="autobloqueo" class="form-label">Autobloqueo de puertas con velocidad:</label>
                            <input type="text" id="autobloqueo" class="form-control"  v-model="seguridad.autobloqueo">
                          </li>
                          <li class="list-group-item">
                            <label for="controlestabilidad" class="form-label">Control de estabilidad:</label>
                            <input type="text" id="controlestabilidad" class="form-control"  v-model="seguridad.controlestabilidad">
                          </li>
                          <li class="list-group-item">
                            <label for="controltraccion" class="form-label">Control de tracción:</label>
                            <input type="text" id="controltraccion" class="form-control"  v-model="seguridad.controltraccion">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="accordion accordion-flush mx-auto"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingFour">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseSix"
                        aria-expanded="true"
                        aria-controls="flush-collapseSix"
                      >
                        Comunicacion y entretenimiento
                      </button>
                    </h2>
                    <div
                      id="flush-collapseSix"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingSix"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- Some borders are removed -->
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            <label for="musica" class="form-label">Equipo de música:</label>
                            <input type="text" id="musica" class="form-control" v-model="entretenimiento.musica">
                          </li>
                          <li class="list-group-item">
                            <label for="bocinas" class="form-label">Bocinas:</label>
                            <input type="text" id="bocinas" class="form-control"  v-model="entretenimiento.bocinas">
                          </li>
                          <li class="list-group-item">
                            <label for="conx" class="form-label">Conexión auxiliar:</label>
                            <input type="text" id="conx" class="form-control"  v-model="entretenimiento.auxiliar">
                          </li>
                          <li class="list-group-item">
                            <label for="interfaz" class="form-label">Interfaz bluetooth:</label>
                            <input type="text" id="interfaz" class="form-control"  v-model="entretenimiento.bluetooth">
                          </li>
                          <li class="list-group-item">
                            <label for="tablero" class="form-label">Pantalla en tablero:</label>
                            <input type="text" id="tablero" class="form-control"  v-model="entretenimiento.tablero">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="accordion accordion-flush mx-auto"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingFour">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseSeven"
                        aria-expanded="true"
                        aria-controls="flush-collapseSeven"
                      >
                        Confort
                      </button>
                    </h2>
                    <div
                      id="flush-collapseSeven"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingSeven"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- Some borders are removed -->
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">
                            <label for="aireacondicionado" class="form-label">Aire acondicionado:</label>
                            <input type="text" id="aireacondicionado" class="form-control" v-model="confort.aireacondicionado">
                          </li>
                          <li class="list-group-item">
                            <label for="asientosdelanteros" class="form-label">Asientos delanteros:</label>
                            <input type="text" id="asientosdelanteros" class="form-control" v-model="confort.asientosdelanteros">
                          </li>
                          <li class="list-group-item">
                            <label for="asientostraseros" class="form-label">Asientos traseros:</label>
                            <input type="text" id="asientostraseros" class="form-control" v-model="confort.asientostraseros">
                          </li>
                          <li class="list-group-item">
                            <label for="cierrepuertas" class="form-label">Cierre de puertas:</label>
                            <input type="text" id="cierrepuertas" class="form-control" v-model="confort.cierrepuertas">
                          </li>
                          <li class="list-group-item">
                            <label for="computadora" class="form-label">Computadora a bordo:</label>
                            <input type="text" id="computadora" class="form-control" v-model="confort.computadora">
                          </li>
                          <li class="list-group-item">
                            <label for="espejoint" class="form-label">Espejo interior:</label>
                            <input type="text" id="espejoint" class="form-control" v-model="confort.espejoint">
                          </li>
                          <li class="list-group-item">
                            <label for="espejoext" class="form-label">Espejos exteriores:</label>
                            <input type="text" id="espejoext" class="form-control" v-model="confort.espejoext">
                          </li>
                          <li class="list-group-item">
                            <label for="farosanti" class="form-label">Faros antiniebla:</label>
                            <input type="text" id="farosanti" class="form-control" v-model="confort.farosanti">
                          </li>
                          <li class="list-group-item">
                            <label for="farosdelanteros" class="form-label">Faros delanteros:</label>
                            <input type="text" id="farosdelanteros" class="form-control" v-model="confort.farosdelanteros">
                          </li>
                          <li class="list-group-item">
                            <label for="palancacambios" class="form-label">Palanca de cambios:</label>
                            <input type="text" id="palancacambios" class="form-control" v-model="confort.palancacambios">
                          </li>
                          <li class="list-group-item">
                            <label for="quemacocos" class="form-label">Quemacocos:</label>
                            <input type="text" id="quemacocos" class="form-control" v-model="confort.quemacocos">
                          </li>
                          <li class="list-group-item">
                            <label for="rines" class="form-label">Rines:</label>
                            <input type="text" id="rines" class="form-control" v-model="confort.rines">
                          </li>
                          <li class="list-group-item">
                            <label for="vestiduras" class="form-label">Vestiduras:</label>
                            <input type="text" id="vestiduras" class="form-control" v-model="confort.vestiduras">
                          </li>
                          <li class="list-group-item">
                            <label for="velocidadcrucero" class="form-label">Control de velocidad crucero:</label>
                            <input type="text" id="velocidadcrucero" class="form-control" v-model="confort.velocidadcrucero">
                          </li>
                          <li class="list-group-item">
                            <label for="vidrios" class="form-label">Vidrios (delanteros y traseros):</label>
                            <input type="text" id="vidrios" class="form-control" v-model="confort.vidrios">
                          </li>
                          <li class="list-group-item">
                            <label for="volante" class="form-label">Volante:</label>
                            <input type="text" id="volante" class="form-control" v-model="confort.volante">
                          </li>
                          <li class="list-group-item">
                            <label for="apertura" class="form-label">Apertura cajuela y tapa combustible:</label>
                            <input type="text" id="apertura" class="form-control" v-model="confort.apertura">
                          </li>
                          <li class="list-group-item">
                            <label for="sensor" class="form-label">Sensor de estacionamiento:</label>
                            <input type="text" id="sensor" class="form-control" v-model="confort.sensor">
                          </li>
                          <li class="list-group-item">
                            <label for="sensor" class="form-label">Cámara de visión trasera:</label>
                            <input type="text" id="sensor" class="form-control" v-model="confort.camara">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="" class="form-label"
                  >Etiquetas</label
                >
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Economico" id="Economico" v-model="etiquetas.economico"/>
                  <label class="form-check-label" for="Economico"> Economico </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Estudiantes" id="Estudiantes"  v-model="etiquetas.estudiantes"/>
                  <label class="form-check-label" for="Estudiantes"> Estudiantes </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Rendidor" id="Rendidor" v-model="etiquetas.rendidor" />
                  <label class="form-check-label" for="Rendidor"> Rendidor </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Cuatro" id="4x4"  v-model="etiquetas.cuatro"/>
                  <label class="form-check-label" for="4x4"> 4x4 </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Carga" id="Carga"  v-model="etiquetas.carga"/>
                  <label class="form-check-label" for="Carga"> Carga </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Pickup" id="Pickup"  v-model="etiquetas.pickup"/>
                  <label class="form-check-label" for="Pickup"> Pickup </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Deportivo" id="Deportivo"  v-model="etiquetas.deportivo"/>
                  <label class="form-check-label" for="Deportivo"> Deportivo </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="Familiar" id="Familiar"  v-model="etiquetas.familiar"/>
                  <label class="form-check-label" for="Familiar"> Familiar </label>
                </div>
              </div>
              <div class="mb-3">
                <label for="" class="form-label"
                  >Precio Inicial</label
                >
                <input
                  type="number"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder="Ejemplo: 45000"
                  v-model="resena.inicial"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label"
                  >Precio Final</label
                >
                <input
                  type="number"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder="Ejemplo: 125000"
                  v-model="resena.final"
                />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">Video de Youtube</label>
                <input
                  type="text"
                  class="form-control"
                  aria-describedby="helpId"
                  placeholder="Incrusta la ID de tu video por ejemplo: U0ZVo4kK3VM"
                  v-model="resena.video"
                />
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Sube una imagen</label>
                <input
                  type="file"
                  class="form-control"
                  id="image"
                  @change="changeHandler"
                />
              </div>
              <div class="mb-3">
                <label for="images" class="form-label"
                  >Sube imagenes al carrete</label
                >
                <input
                  type="file"
                  class="form-control"
                  id="images"
                  multiple
                  @change="handleCarrete"
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary btn-block w-100 mt-2"
              >
                Crear reseña
              </button>
              <RouterLink to="/res" class="btn btn-danger btn-block w-100 mt-2"
                >Regresar</RouterLink
              >
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
