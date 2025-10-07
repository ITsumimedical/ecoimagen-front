<template>
  <div>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <!-- Componente de búsqueda de afiliado -->
    <v-card>
	  <v-alert text dense border="left" type="info" :icon="false" class="text-center"><b>CREAR EMPALME</b></v-alert>
      <v-container>
        <v-row>
          <v-col sm="6" md="6">
            <v-text-field v-model="cedulaAfiliado" append-icon="mdi-magnify" @keyup.enter="buscarAfiliado"
              label="Número Documento" type="number" autofocus dense></v-text-field>
          </v-col>
          <!-- Boton de buscar -->
          <v-col cols="12" sm="12" md="3">
            <v-btn color="boton" small dark @click="buscarAfiliado()">Buscar</v-btn>
            <v-btn color="orange" small dark @click="limpiar()">Limpiar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-dialog v-model="dialog" max-width="1400px" persistent>
      <v-card flat>
        <v-col cols="12" sm="12" md="12">
          <v-alert border="left" dense text outlined color="info" icon="mdi-account-box-edit-outline"><b>Datos del
              Afiliado</b>
          </v-alert>
        </v-col>
          <v-card-text :loading="loading" :disabled="loading">
            <component :is="componente" :datos="datos" :datosBasicos="true" :camposNoEditables="true"
              @respuestaComponente="limpiarComponente()" />
          </v-card-text>
          <v-form>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Tipo Documento" v-model="afiliado.Tipo_Documento" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Numero Documento" v-model="afiliado.cedula" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Tipo Cotizante" v-model="afiliado.tipo_cotizante" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field dense label="Nombre del Afiliado" v-model="afiliado.nombre_completo" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Sexo" v-model="afiliado.sexo" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Fecha Nacimiento" v-model="afiliado.fecha_nacimiento" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Edad Cumplida" v-model="afiliado.edad_cumplida" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field dense label="Entidad" v-model="afiliado.nombre_entidad" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Departamento" v-model="afiliado.Departamento_afiliacion" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="Municipio" v-model="afiliado.Municipio_afiliacion" outlined readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select :items="Ut" dense label="Ut Saliente" v-model="afiliado.Ut" outlined>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select :items="Hijos" dense label="Número Hijos" v-model="afiliado.numero_hijos" outlined>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select :items="Escolaridad" dense label="Nivel Escolaridad" v-model="afiliado.escolaridad"
                    outlined>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select :items="Nivel" dense label="Estrato" v-model="afiliado.estrato" outlined>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="8" md="8">
                  <v-autocomplete dense :items="cie10" item-value="id" item-text="name" label="Diagnóstico Principal"
                    outlined v-model="empalmeCrear.cie10s_id" required
                    :error-messages="!empalmeCrear.cie10s_id ? ['Este campo es obligatorio'] : []">
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select dense :items="Servicio" v-model="empalmeCrear.tipo_servicio" label="Tipo de servicio"
                    outlined :error-messages="!empalmeCrear.tipo_servicio ? ['Este campo es obligatorio'] : []"
                    required>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12"
                  v-show="empalmeCrear.tipo_servicio === 'Medicamentos' || empalmeCrear.tipo_servicio == 'Ambos'">
                  <v-autocomplete dense :items="codesumis" item-text="nombre" v-model="empalmeCrear.codesumi_id"
                    outlined label="Molecula" chips deletable-chips multiple prepend-icon="mdi-pill" item-value="id"
                    :error-messages="!empalmeCrear.codesumi_id ? ['Este campo es obligatorio'] : []">
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12"
                  v-show="empalmeCrear.tipo_servicio === 'Servicio' || empalmeCrear.tipo_servicio == 'Ambos'">
                  <v-autocomplete dense :items="cups" :item-text="c => c.codigo + ' - ' + c.nombre" item-value="id"
                    outlined v-model="empalmeCrear.cup_id" label="Servicios" chips deletable-chips multiple
                    prepend-icon="mdi-medical-bag"
                    :error-messages="!empalmeCrear.cup_id ? ['Este campo es obligatorio'] : []">
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12"
                  v-show="empalmeCrear.tipo_servicio === 'Medicamentos' || empalmeCrear.tipo_servicio == 'Ambos'">
                  <v-autocomplete dense :items="codePropios" :item-text="'CodigoNombre'" item-value="id" outlined
                    v-model="empalmeCrear.codigo_propio_id" label="Codigo Propio IPS" chips deletable-chips multiple
                    prepend-icon="mdi-contrast-box"
                    :error-messages="!empalmeCrear.codigo_propio_id ? ['Este campo es obligatorio'] : []">
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="3" md="3">
                  <v-text-field dense label="fecha_solicitud" v-model="empalmeCrear.fecha_solicitud" type="date"
                    outlined :error-messages="!empalmeCrear.fecha_solicitud ? ['Este campo es obligatorio'] : []"
                    required>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select dense :items="Tutela" v-model="empalmeCrear.tutela" label="Tutela" outlined
                    :error-messages="!empalmeCrear.tutela ? ['Este campo es obligatorio'] : []" required>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select dense :items="Represa" v-model="empalmeCrear.acepta_represa" label="Acepta Represa" outlined
                    :error-messages="!empalmeCrear.acepta_represa ? ['Este campo es obligatorio'] : []" required>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="3" md="6">
                  <v-text-field dense v-model="empalmeCrear.anexos" label="Anexos" required outlined>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea v-model="empalmeCrear.observaciones_contratista" label="Observaciones Contratista"
                    autoGrow outline
                    :error-messages="!empalmeCrear.observaciones_contratista ? ['Este campo es obligatorio'] : []"
                    required>
                  </v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-file-input counter show-size truncate-length="10" v-model="adjuntos" small-chips multiple outlined
                    dense label="Adjuntar" accept=".jpg, .jpeg, .pdf"></v-file-input>
                </v-col>
              </v-layout>
            </v-container>
            <v-layout>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-btn color="red" dark small @click="CancelarEmpalme()">Cancelar</v-btn>
                <v-btn color="success" dark small @click="guardarEmpalme()">Guardar</v-btn>
              </v-card-actions>
            </v-layout>
          </v-form>
      </v-card>
    </v-dialog>

    <!-- Tabla de datos -->
    <v-card flat>
      <v-col sm="6" md="6">
        <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar" single-line hide-details dense>
        </v-text-field>
      </v-col>
      <v-data-table :headers="headers" :items="empalme" :search="buscar" class="elevation-1" :loading="loading"
        loading-text="Cargando..." hide-default-footer dense>
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.cedula }}</td>
          <td>{{ props.item.primer_nombre }}</td>
          <td>{{ props.item.nombre_entidad }}</td>
          <td>{{ props.item.fecha_solicitud }}</td>
          <td>
            <v-tooltip>
              <template v-slot:activator="{ on, attrs }">
                <v-icon small color="red" class="mr-2" v-bind="attrs" v-on="on"
                  @click="abrirAdjunto(props.item.adjuntos)">
                  mdi-cloud-download-outline
                </v-icon>
              </template>
              <span>Adjuntos</span>
            </v-tooltip>
          </td>
        </template>
      </v-data-table>
      <v-row no-gutters style="background-color: white;">
        <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
          <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
            @input="listarEmpalme"></v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarEmpalme()">
          </v-select>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {

  middleware({
    $can,
    redirect
  }) {
    if (!$can('empalme.listarFerrocarriles')) {
      return redirect('/');
    }
  },

  data() {
    return {
      cedulaAfiliado: '',
      loading: false,
      componente: null,
      datos: null,
      servicio: [],
      preload: false,
      empalme: [],
      mostrarTabla: false,
      preload: null,
      cie10: [],
      codesumis: [],
      cups: [],
      codePropios: [],
      dialog: false,
      buscar: '',
      pagina: 1,
      total: 0,
      opcionActual: 5,
      opciones: [5, 10, 20, 50, 100],
      adjuntos: [],

      Represa: [
        'Si',
        'No'
      ],
      Tutela: [
        'Si',
        'No'
      ],
      Servicio: [
        'Servicio',
        'Medicamentos',
        'Ambos'
      ],
      Ut: [
        'FMP Antioquia',
        'FMP Cesar',
        'FMP Santander',
        'FMP Norte de Santander'
      ],
      Escolaridad: [
        'Primaria',
        'Bachiller',
        'Tecnólogo',
        'Tecnico',
        'Universitario',
        'Posgrado'
      ],
      Hijos: [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
      ],
      Nivel: [
        '1', '2', '3', '4', '5', '6'
      ],
      empalmeCrear: {
        cie10s_id: null,
        tipo_servicio: '',
        fecha_solicitud: '',
        tutela: '',
        acepta_represa: '',
        observaciones_contratista: '',
        codesumi_id: null,
        cup_id: null,
        codigo_propio_id: null,
        anexos: '',
        id_Empalme: ''
      },

      afiliado: {
        nombre_completo: '',
        nombre_entidad: '',
        Tipo_Documento: '',
        cedula: '',
        sexo: '',
        fecha_nacimiento: '',
        Departamento_afiliacion: '',
        Municipio_afiliacion: '',
        edad_cumplida: '',
        tipo_cotizante: '',
        Ut: '',
        numero_hijos: '',
        estrato: '',
        escolaridad: ''

      },
      headers: [
        {
          text: 'id',
          value: 'id_Empalme'
        },
        {
          text: 'Cedula',
          value: 'Cedula'
        },
        {
          text: 'Nombre',
          value: 'nombreAfiliado'
        },
        {
          text: 'Entidad',
          value: 'nombre_entidad'
        },
        {
          text: 'Fecha Solicitud',
          value: 'fecha_solicitud'
        },
        {
          text: 'Adjuntos',
          value: 'adjuntos',
          sortable: false
        },
      ],
    };
  },


  mounted() {
    this.listarEmpalme()
    this.ListarCie10()
    this.listarCups()
    this.listarCodigosPropios()
    this.listarCodesumi()
  },

  methods: {

    //Funcion para buscar afiliado
    buscarAfiliado() {
      this.preload = true;

      // Validar si el paciente ya tiene un empalme registrado
      this.$axios.get(`/empalme/existeEmpalme/${this.cedulaAfiliado}`)
        .then((res) => {
          const empalmeExiste = res.data.existe;

          if (empalmeExiste) {
            this.$toast.error('Este paciente ya tiene un empalme registrado.');
            this.preload = false;
            return;
          }

          // Si no tiene empalme registrado, continuar con la búsqueda
          this.$axios.post(`/empalme/listarporEntidades/${this.cedulaAfiliado}`)
            .then((res) => {
              const afiliado = res.data;
              if ('mensaje' in afiliado) {
                this.$toast.error(afiliado.mensaje);
                this.preload = false;
                return;
              }

              if (afiliado.entidad_id === 3) {
                this.dialog = true;
                this.afiliado = afiliado;
              }
              this.preload = false;

              if (afiliado.entidad_id !== 3) {
                this.$toast.success('El afiliado pertenece a otra entidad.');
              }
            })
            .catch(() => {
              this.preload = false;
              this.$toast.error('Hubo un error al buscar afiliados. Por favor, inténtalo de nuevo.');
            });
        })
        .catch((error) => {
          console.error('Error al verificar empalmes:', error);
          this.preload = false;
          this.$toast.error('Hubo un error al verificar la existencia de empalmes. Por favor, inténtalo de nuevo.');
        });
    },

    //Funcion para guardar Empalme
    guardarEmpalme() {
      const adjuntos = this.adjuntos;
      if (!adjuntos || adjuntos.length === 0) {
        return this.$swal({
          type: 'error',
          title: '¡Atención!',
          text: 'Por favor, adjunte al menos un archivo antes de guardar el empalme.',
        });
      }

      const formData = new FormData();
      formData.append('afiliado_id', this.afiliado.id);
      formData.append('cie10s_id', this.empalmeCrear.cie10s_id);
      formData.append('tipo_servicio', this.empalmeCrear.tipo_servicio);
      formData.append('fecha_solicitud', this.empalmeCrear.fecha_solicitud);
      formData.append('tutela', this.empalmeCrear.tutela);
      formData.append('acepta_represa', this.empalmeCrear.acepta_represa);
      formData.append('observaciones_contratista', this.empalmeCrear.observaciones_contratista);
      formData.append('codesumi_id', this.empalmeCrear.codesumi_id);
      formData.append('cup_id', this.empalmeCrear.cup_id);
      formData.append('codigo_propio_id', this.empalmeCrear.codigo_propio_id);
      formData.append('anexos', this.empalmeCrear.anexos);

      for (let i = 0; i < adjuntos.length; i++) {
        formData.append(`adjuntos[]`, adjuntos[i]);
      }
      this.$axios.post('/empalme/crear', formData)
        .then(res => {
          if (res.data && typeof res.data === 'object') {
            const empalmeId = res.data.id ?? null;
            this.dialog = false;
            this.$toast.success('Empalme guardado exitosamente.');
            this.listarEmpalme();

            this.empalmeCrear = {
              cie10s_id: null,
              tipo_servicio: '',
              fecha_solicitud: '',
              tutela: '',
              acepta_represa: '',
              observaciones_contratista: '',
              id_Empalme: empalmeId
            };
            this.adjuntos = '';
            this.cedulaAfiliado = '';
          }
        })
        .catch(err => {
          this.$toast.error('Error al guardar el empalme. Por favor, inténtalo de nuevo.');
        });
    },


    CancelarEmpalme() {
      this.dialog = false;
      this.adjuntos = '';
      this.cedulaAfiliado = '';
      this.empalmeCrear = {
        cie10s_id: null,
        tipo_servicio: '',
        fecha_solicitud: '',
        tutela: '',
        acepta_represa: '',
        observaciones_contratista: ''
      };
    },

    //Funcion para listar los cie10
    ListarCie10() {
      this.preload = true;
      this.$axios.get('/cie10/listar')
        .then(res => {
          if (Array.isArray(res.data)) {
            const formattedData = res.data.map(item => {
              const id = item.id;

              const [codigo, ...nombreParts] = item.Codigo_Nombre.split(' - ');
              const nombre = nombreParts.join(' - ').trim();

              return {
                id: id,
                name: item.Codigo_Nombre.trim(),
              };
            });

            this.cie10 = formattedData;
            this.preload = false;
          } else {
            console.error('Datos no válidos recibidos del servidor:', res.data);
            this.preload = false;
          }
        })
        .catch(e => {
          this.preload = false;
          console.error('Error al obtener la lista de CIE10:', e);
        });
    },

    //Funcion para listar los empalmes creados
    listarEmpalme() {
      this.preload = true;
      this.$axios.get('/empalme/listarFerrocarriles?page=' + this.pagina + '&cantidad=' + this.opcionActual)
        .then(res => {
          this.empalme = res.data.data;
          this.total = res.data.last_page;
          this.mostrarTabla = true;
          this.preload = false;
        })
        .catch(e => {
          this.preload = false;
        });
    },
    listarCodigosPropios() {
      this.$axios.post('/codigo-propio/listar')
        .then((res) => {
          this.codePropios = res.data.data;
        })
    },
    listarCups() {
      this.preload = true;
      this.$axios.post('/cup/listar').then(res => {
        this.cups = res.data.data;
        this.preload = false
      }).catch(e => {
      })
    },

    listarCodesumi() {
      this.preload = true;
      this.$axios.post('/codesumis/listarCodigosSumi').then(res => {
        this.codesumis = res.data;
        this.preload = false
      }).catch(e => {
      })
    },

    //Funcion para limpiar la cedula
    limpiar() {
      this.cedulaAfiliado = '';
    },
    abrirAdjunto(rutaAdjunto) {
      window.open(rutaAdjunto, '_blank');
    },

    limpiarComponente() {
      this.componente = null;
      this.crear = false;
      this.datos = {};
      this.cedula_paciente = "";
    },

  },

};
</script>
