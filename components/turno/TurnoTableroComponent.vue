<template>
  <!-- caja de cedula -->
  <div class="caja">
    <div class="documento" v-if="form.documento">
      {{ form.documento }}
    </div>
    <div class="no-documento" v-else>
      Digita tu documento
    </div>

    <!-- nombre del paciente -->
    <div class="info-usuario" v-if="usuario">
      {{ usuario.primer_nombre}} {{ usuario.segundo_nombre}} {{ usuario.primer_apellido }}
      {{ usuario.segundo_apellido }}
    </div>

    <div class="info-usuario" v-if="usuario">
      Escoja su turno
    </div>

    <!-- teclado virtual -->
    <div class="teclado" v-if="!documento_validado">
      <div @click="concatenar('1')" class="tecla numero">1</div>
      <div @click="concatenar('2')" class="tecla numero">2</div>
      <div @click="concatenar('3')" class="tecla numero">3</div>
      <div @click="concatenar('4')" class="tecla numero">4</div>
      <div @click="concatenar('5')" class="tecla numero">5</div>
      <div @click="concatenar('6')" class="tecla numero">6</div>
      <div @click="concatenar('7')" class="tecla numero">7</div>
      <div @click="concatenar('8')" class="tecla numero">8</div>
      <div @click="concatenar('9')" class="tecla numero">9</div>
      <div @click="limpiar()" class="tecla limpiar">
        <v-icon size="60px">mdi-delete</v-icon>
      </div>
      <div @click="concatenar('0')" class="tecla numero">0</div>
      <div @click="consultarAfiliado()" class="tecla enviar">
        <v-icon size="60px">mdi-check-bold</v-icon>
      </div>
    </div>

    <!-- tipos de turno para escoger -->
    <div class="tipos" v-else>
      <div v-for="tipo_turno in tipos_turnos" :key="tipo_turno.id" @click="guardarTurno(tipo_turno.id)">
        <v-card :color="'#'+tipo_turno.color" outlined>
          <v-row justify="center">
            <v-col cols="auto" md="auto" sm="auto">
              <v-card-title>
                <p class="text-h4 text--primary">{{ tipo_turno.nombre }}</p>
              </v-card-title>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- boton para regresar al teclado virtual -->
      <v-fab-transition>
        <v-btn fab large dark fixed bottom left class="v-btn--example" @click="atras()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-fab-transition>
    </div>

    <!-- modal para modificar aera del turnero -->
    <div class="text-center">
      <v-dialog v-model="dialogo" width="40%">
        <v-card>
          <v-card-title>
            Cambiar area del turnero
          </v-card-title>
          <v-card-text>
            <v-select v-model="form.area_clinica_id" :items="areas" label="Area del turnero" item-text="nombre"
              item-value="id" solo></v-select>
            <v-btn color="red" text @click="dialogo = false">Cerrar</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

  </div>
</template>
<script>
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'TurnoTablero',

    data() {
      return {
        tipos_turnos: [],
        areas: [],
        form: {
          documento: '',
          area_clinica_id: 1
        },
        documento_validado: false,
        usuario: null,
        dialogo: true
      }
    },

    mounted() {
      this.getTipoTurnos()
      this.getAreas()
    },

    methods: {

      /**
       * Obtiene los tipos de turno posibles
       */
      async getTipoTurnos() {
        try {
          const response = await this.$axios.get('/tipo-turno');
          this.tipos_turnos = response.data
        } catch (error) {
          console.error(error);
        }
      },

      /**
       * Obtiene las areas
       */
      async getAreas() {
        try {
          const response = await this.$axios.get('/area-clinica');
          this.areas = response.data;
        } catch (error) {
          console.log('ocurrio un error');
        }
      },

      /**
       * Almacena un turno
       * @param tipo_turno_id
       */
      async guardarTurno(tipo_turno_id) {
        try {

          if (!this.form.documento)
            this.limpiar();

          const request = {
            'tipo_turno_id': tipo_turno_id,
            'numero_documento': this.form.documento,
            'area_clinica_id': this.form.area_clinica_id
          }
          const response = await this.$axios.post('/turno', request)
          /** imprime :D */
          this.limpiar();
        } catch (error) {
          console.log(error.response)
        }
      },

      /**
       * Valida que el documento exista, de existir guarda el usuario
       */
      async consultarAfiliado() {
        try {
          if (!this.form.documento) {
            return;
          }
          /** Es para cambiar el area al que pertenece el turnero */
          if (this.form.documento === "1234") {
            this.dialogo = true;
            return;
          }

          const response = await this.$axios.get('/afiliado/' + this.form.documento);
          this.usuario = response.data;
          this.documento_validado = true;
        } catch (error) {
          console.log(error.response)
        }
      },

      concatenar(numero) {
        if (this.form.documento.length > 15) return
        this.form.documento += numero;
      },

      eliminar() {
        const cadena = this.form.documento
        this.form.documento = cadena.slice(0, -1)
      },

      limpiar() {
        this.form.documento = ''
        this.usuario = null
        this.documento_validado = false;
      },

      atras() {
        this.documento_validado = false;
        this.limpiar()
      }
    }
  }

</script>
<style>
  .teclado {
    width: 65%;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }

  .teclado div {
    border-radius: 3%;
    height: 150px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tipos {
    width: 90%;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .tipos div {
    border-radius: 5%;
    height: 150px;
    width: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .numero {
    background-color: #E1F5FE;
    border: 3px solid #039BE5;
    color: #37474F;
    font-weight: bolder;
    font-size: 70px;
    translate: .3;
  }

  .tecla {
    cursor: pointer;
    padding: 1em;
  }

  .numero:hover {
    border: 5px solid #039BE5;
  }

  .enviar {
    background-color: #81C784;
    border: 3px solid #388E3C;
    color: #37474F;
    font-weight: bolder;
    translate: .3;
  }

  .limpiar {
    background-color: #EF9A9A;
    border: 3px solid #D32F2F;
    color: #37474F;
    font-weight: bolder;
    translate: .3;
  }

  .info-usuario {
    font-family: 'Courier New', Courier, monospace;
    text-align: center;
    font-weight: bolder;
    font-size: 40px;
  }

  .documento {
    text-align: center;
    font-weight: bolder;
    font-size: 60px;
    padding: 2rem 1rem;
    margin-bottom: 2rem;
    background-color: white;
    -webkit-box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.3);
  }

  .no-documento {
    text-align: center;
    font-weight: bolder;
    font-size: 60px;
    padding: 2rem 1rem;
    margin-bottom: 2rem;
    background-color: white;
    -webkit-box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.3);
    color: #EEEEEE;
  }

</style>
