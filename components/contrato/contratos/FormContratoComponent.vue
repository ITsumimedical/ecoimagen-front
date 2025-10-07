<template>
  <v-card>

    <!-- lista los errores que puedan ocurrir en el proceso -->
    <v-card-text v-if="errores.length > 0">
      <v-alert color="red" outlined prominent type="error">
        <ul>
          <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
        </ul>
      </v-alert>

    </v-card-text>

    <v-dialog v-model="dialogAdjuntos" persistent max-width="1000">
      <v-card>
        <v-card-title class="text-h5">
          Adjuntos
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-wrap">
            <v-btn v-for="(adjunto, index) in adjuntos" :key="index" class="mr-2 mb-2 d-flex align-center"
              @click="abrirArchivo(adjunto.ruta)" outlined>
              <v-icon class="mr-3">
                mdi-folder-zip-outline
              </v-icon>
              {{ adjunto.nombre }}
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark @click="dialogAdjuntos = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="d-flex justify-space-between">
          <small class="d-block mb-8">Campos obligatorios con *</small>
          <CargaMasivaContratosComponent v-if="!editando" />
        </div>

        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete :disabled="editando" v-model="form.prestador_id" label="Nit o nombre del prestador *"
              :items="prestadores" item-value="id" item-text="nombre" :search-input.sync="rep"
              :rules="rules.prestador_id" outlined dense :loading="loading.prestadores" @change="handleCambioPrestador"
              no-data-text="Digite el nit o nombre del prestador">
            </v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-autocomplete :items="ambitos" item-text="nombre" item-value="id" label="Ámbito *" dense outlined
              v-model="form.ambito_id" :rules="rules.ambito_id"></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Fecha de inicio *" v-model="form.fecha_inicio" type="date" dense outlined
              :rules="rules.fecha_inicio"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Fecha de terminación *" v-model="form.fecha_termina" type="date" dense outlined
              :rules="rules.fecha_termina"></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="12">
            <v-autocomplete :items="entidades" item-text="nombre" item-value="id" outlined label="Entidad *" dense
              v-model="form.entidad_id" :rules="rules.entidad_id"></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="3">
                <v-checkbox v-model="form.capitado" outlined label="Capitado" color="primary" class="mt-0"></v-checkbox>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox v-model="form.pgp" outlined label="pgp" color="primary" class="mt-0"></v-checkbox>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox v-model="form.evento" outlined label="Evento" color="primary" class="mt-0"></v-checkbox>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox v-model="form.poliza" outlined label="Poliza" color="primary" class="mt-0"></v-checkbox>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox v-model="form.renovacion" outlined label="Renovación" color="primary" class="mt-0">
                </v-checkbox>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox v-model="form.modificacion" outlined label="Modificación" color="primary" class="mt-0">
                </v-checkbox>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="12" md="12">
            <v-textarea label="Descripción" outlined auto-grow v-model="form.descripcion"
              :error-messages="errores.descripcion"></v-textarea>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete :items="tipo_reportes" item-text="nombre" item-value="id" outlined label="Tipo de reporte"
              dense v-model="form.tipo_reporte"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete :items="lineas_negocio" item-text="nombre" item-value="id" outlined label="Linea de negocio"
              dense v-model="form.linea_negocio"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete :items="regimenes" item-text="nombre" item-value="id" outlined label="Régimen" dense
              v-model="form.regimen"></v-autocomplete>
          </v-col>

          <!-- <v-col cols="12" md="4">
            <v-autocomplete :items="documentos" item-text="nombre" item-value="id" outlined
              label="Tipo documento proveedor" dense v-model="form.documento_proveedor_id"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field label="Documento proveedor" dense outlined v-model="form.documento_proveedor"></v-text-field>
          </v-col> -->

          <v-col cols="12" md="4">
            <v-autocomplete :items="naturalezas_juridicas" item-text="nombre" item-value="id" outlined
              label="Naturaleza juridica" dense v-model="form.naturaleza_juridica"></v-autocomplete>
          </v-col>

          <!-- <v-col cols="12" md="4">
            <v-text-field label="Código de habilitación" dense outlined v-model="form.codigo_habilitacion"
              :rules="rules.codigo_habilitacion"></v-text-field>
          </v-col> -->

          <v-col cols="12" md="4">
            <v-autocomplete :items="componentes" item-text="nombre" item-value="id" outlined label="Componente" dense
              v-model="form.componente"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete :items="tipo_servicios" item-text="nombre" item-value="id" outlined label="Tipo de servicio"
              dense v-model="form.tipo_servicio"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete :items="tipos_proveedores" item-text="nombre" item-value="id" outlined
              label="Tipo de proveedor" dense v-model="form.tipo_proveedor"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field label="Código de contrato" dense outlined v-model="form.codigo_contrato"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field label="Poblacion cubierta" dense outlined type="number" v-model="form.poblacion_cubierta">
            </v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-textarea label="Objeto de contrato" dense outlined v-model="form.obj_contrato"></v-textarea>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete :items="modalidades_pagos" item-text="nombre" item-value="id" outlined
              label="Modalidad de pago" dense v-model="form.modalidad_pago"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field label="Otra modalidad" dense outlined v-model="form.otra_modalidad"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete :items="tipo_modificaciones" item-text="nombre" item-value="id" outlined
              label="Tipo modificación" dense v-model="form.tipo_modificacion"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field label="Valor del contrato" dense outlined type="number" v-model.number="form.valor_contrato">
            </v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field label="Valor adición" dense outlined type="number" v-model.number="form.valor_adicion">
            </v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field label="Valor ejecutado" dense outlined type="number" v-model.number="form.valor_ejecutado">
            </v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-file-input v-model="form.files" label="Click para adjuntar archivos" multiple dense outlined counter
              show-size small-chips truncate-length="25"></v-file-input>
          </v-col>

        </v-row>

      </v-form>
    </v-card-text>

    <v-col cols="12" v-if="editando">
      <v-alert dense text type="info">
        <b>Novedades</b>
      </v-alert>

      <v-textarea v-model="form.novedad" label="Novedad" dense outlined>
      </v-textarea>

      <v-data-table :headers="headersNovedades" :items="novedades" class="mb-5">
        <v-data-table :headers="headers" :items="items">
        <template v-slot:[`item.usuario.operador.nombre_completo`]="{ item }">
            {{ item.usuario.operador.nombre }} {{ item.usuario.operador.apellido }}
        </template>
        </v-data-table>
        <template v-slot:[`item.adjuntos`]="{ item }">
          <!-- Acción de editar -->
          <v-tooltip top v-if="item.adjunto_novedad_contratos && item.adjunto_novedad_contratos.length > 0">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" v-bind="attrs" v-on="on" @click="dialogoAdjuntos(item)">
                mdi-cloud-print
              </v-icon>
            </template>
            <span>Ver Adjuntos</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" v-if="!editando" small @click="limpiar()">Limpiar</v-btn>
      <v-btn color="error" v-else small @click="$emit('cerrar')">Cerrar</v-btn>
      <v-btn @click="submit()" small color="success">
        {{ editando ? "Editar" : "Guardar" }}
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
  import CargaMasivaContratosComponent from '@/components/contrato/contratos/CargaMasivaContratosComponent.vue';
  import moment from 'moment'
  import {
    mapActions
  } from 'vuex';

  moment.locale('es');
  export default {

    components: {
      CargaMasivaContratosComponent
    },

    name: "FormContrato",
    props: {
      editando: {
        type: Boolean,
        default: false
      },
      contrato_id: {
        type: Number,
        default: null
      },
    },

    data() {
      return {
        timeout: null, //este valor setea un timeout para ejecutar la consulta luego
        bandera: true, // si esta en true el tipeo en el auto completar del prestador debe de buscar
        loading: {
          prestadores: false
        },
        tipo_reportes: [{
            id: 1,
            nombre: "Reporte periodico"
          },
          {
            id: 2,
            nombre: "Actualizacion de la red"
          }
        ],
        lineas_negocio: [{
            id: 1,
            nombre: "Aseguramineto obligatorio"
          },
          {
            id: 2,
            nombre: "Aseguramiento voluntario"
          }
        ],
        regimenes: [{
            id: 1,
            nombre: 'Contributivo'
          },
          {
            id: 2,
            nombre: 'Subsidiado'

          },
          {
            id: 3,
            nombre: 'Voluntario'
          }, {
            id: 4,
            nombre: "Exceptuado y especial"
          }, {
            id: 5,
            nombre: 'No aplica'
          }
        ],
        documentos: [{
            id: 'NI',
            nombre: "Nit"
          },
          {
            id: 'CC',
            nombre: "Cedula de ciudadania"
          },
          {
            id: 'CE',
            nombre: "Cedula extranjeria"
          },
          {
            id: 'PT',
            nombre: "Permiso de proteccion temporal"
          },
          {
            id: 'DE',
            nombre: "Documento extranjero"
          },
          {
            id: 'CD',
            nombre: "Carnet diplomatic"
          },
          {
            id: 'PE',
            nombre: "Contributivo"
          },
          {
            id: 'PA',
            nombre: "Pasaporte"
          },
        ],
        naturalezas_juridicas: [{
            nombre: "Privada"
          },
          {
            nombre: "Mixta"
          },
          {
            nombre: "Publica"
          },
        ],
        componentes: [{
            id: 1,
            nombre: "Componente primario"
          },
          {
            id: 2,
            nombre: "Componente complementario"
          },
          {
            id: 3,
            nombre: "NA"
          },
        ],
        tipo_servicios: [{
            id: 1,
            nombre: "Servicios de salud"
          },
          {
            id: 2,
            nombre: "Medicamentos"
          },
          {
            id: 3,
            nombre: "Dispositivos medicos"
          },
        ],
        tipo_relaciones: [{
            id: 1,
            nombre: "Cartas de intención"
          },
          {
            id: 2,
            nombre: "Acuerdo de voluntades"
          },
          {
            id: 3,
            nombre: "Contratos vigentes"
          },
        ],
        modalidades_pagos: [{
            id: 1,
            nombre: "Pago por evento"
          },
          {
            id: 2,
            nombre: "Pago por capitacion"
          },
          {
            id: 7,
            nombre: "Pago individual por caso, conjunto integral de atenciones, paquete o canasta"
          },
          {
            id: 8,
            nombre: "Pago global prospectivo"
          },
          {
            id: 6,
            nombre: "Otro"
          },
        ],
        tipo_modificaciones: [{
            id: 0,
            nombre: "No tuvo modificacion"
          },
          {
            id: 1,
            nombre: "Prorroga"
          },
          {
            id: 2,
            nombre: "Otrosi"
          },
          {
            id: 3,
            nombre: "Adicion"
          },
          {
            id: 4,
            nombre: "NA"
          },
        ],
        estados: [{
            id: 1,
            nombre: "En ejecucion"
          },
          {
            id: 2,
            nombre: "Cnacelado / Terminado"
          },
          {
            id: 3,
            nombre: "NA"
          },
          {
            id: 4,
            nombre: "Liquidado"
          },
        ],
        uniones_temporales: [{
            id: 0,
            nombre: "No aplica"
          },
          {
            id: 1,
            nombre: "Union temporal"
          },
          {
            id: 2,
            nombre: "Consorcio"
          },
        ],
        tipos_proveedores: [{
            id: 1,
            nombre: "Prestadores de servicio de salud"
          },
          {
            id: 2,
            nombre: "Gestores farmaceuticos"
          },
          {
            id: 3,
            nombre: "Operadores logisticos de tecnologias en salud"
          },
        ],
        tipos_reds: [{
            id: 0,
            nombre: "No pertenece a ninguna de las listadas"
          },
          {
            id: 1,
            nombre: "Cancer infaltil"
          },
          {
            id: 2,
            nombre: "Eutanasia"
          },
          {
            id: 3,
            nombre: "Suicidio asistido"
          },
          {
            id: 4,
            nombre: "Discapacidad"
          },
          {
            id: 5,
            nombre: "Interrupcion voluntaria del embarazo"
          },
        ],
        estados: [{
          'nombre': 'Activo',
          'id': 1
        }, {
          'nombre': 'Inactivo',
          'id': 0
        }],
        valid: true,
        ambitos: [],
        entidades: [],
        prestadores: [],
        novedad_contratos: [],
        rep: null,
        novedad: null,
        form: {
          fecha_inicio: null,
          fecha_termina: null,
          files: [], //archivos adjuntos
          ambito_id: null,
          entidad_id: null,
          prestador_id: null,
          descripcion: null,
          pgp: false,
          capitado: false,
          evento: false,
          novedad: null,
          poliza: false,
          renovacion: false,
          modificacion: false,
          tipo_reporte: null,
          linea_negocio: null,
          regimen: null,
          documento_proveedor_id: null,
          documento_proveedor: null,
          naturaleza_juridica: null,
          codigo_habilitacion: '',
          componente: null,
          tipo_servicio: null,
          tipo_relacion: null,
          codigo_contrato: null,
          obj_contrato: null,
          poblacion_cubierta: 0,
          modalidad_pago: null,
          otra_modalidad: null,
          tipo_modificacion: null,
          valor_contrato: 0,
          valor_adicion: 0,
          valor_ejecutado: 0,
          estado: null,
          union_temporal: null,
          union_temporal_id: null,
          tipo_proveedor: null,
          tipo_red: null,
          novedad: null,
        },
        rules: {
          prestador_id: [
            v => !!v || 'El prestador es requerido'
          ],
          entidad_id: [
            v => !!v || 'La entidad es requerida'
          ],
          ambito_id: [
            v => !!v || 'El ambito es requerido'
          ],
          fecha_inicio: [
            v => !!v || 'La fecha de inicio es requerida'
          ],
          fecha_termina: [
            v => !!v || 'La fecha de termino es requerida'
          ],
          codigo_habilitacion: [
            v => !!v || 'El código de habilitación es requerido',
            v => (v && v.length >= 8) || 'El código de habilitación debe tener mínimo 8 dígitos'
          ],
          novedad: [
            v => !!v || 'La novedad es requerida'
          ]
        },
        errores: [],
        headersNovedades: [{
            text: 'Detalle',
            value: 'descripcion'
          },
          {
            text: 'Fecha',
            value: 'created_at'
          },
          {
            text: 'Usuario',
            value: 'usuario.operador.nombre_completo'
          },
          {
            text: 'Adjuntos',
            value: 'adjuntos'
          },
        ],
        novedades: [],
        adjuntos: [],
        dialogAdjuntos: false,
      };
    },

    mounted() {
      this.getEntidades();
      this.getAmbitos();
      if (this.editando) {
        this.getContrato()
      }
    },

    watch: {
      rep(val) {
        clearTimeout(this.timeout)
        if (val && this.bandera) {
          this.timeout = setTimeout(() => {
            this.getPrestadores();
          }, 700)
        }
        this.bandera = true;
      },

      contrato_id() {
        if (this.editando) {
          this.getContrato()
        }
      },

      async 'form.prestador_id'(valor) {
        if (!valor) return;
        const tieneContrato = await this.getTieneContrato(valor);
        if (tieneContrato && tieneContrato.length > 0) {
          const entidadAmbitoErrores = tieneContrato.map(
            contrato => contrato.entidad_ambito
          );

          this.pintarErrores({
            error: 'Este prestador ya tiene contratos',
            entidad_ambito: entidadAmbitoErrores // este es un array de mensajes
          });

          // Hacemos scroll hasta el top de la pantalla
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          this.errores = [];
        }
      }


    },

    methods: {
      ...mapActions('app', ['setPreload']),
      /**
       * Obtiene los prestadores
       */
      async getPrestadores() {
        try {
          this.loading.prestadores = true;
          const response = await this.$axios.get('/prestador?filtro=' + this.rep)

          if (response.data.length < 1) {
            throw new Error("Sin resultados");
          }

          this.prestadores = response.data.map((prestador) => {
            return {
              id: prestador.id,
              nombre: `${prestador.nombre_prestador} - ${prestador.nit} - ${prestador.municipio.departamento.nombre}`,
            }
          })
        } catch (error) {
          this.$toast.info('Sin resultados')
        } finally {
          this.loading.prestadores = false;
        }
      },

      async getAmbitos() {
        try {
          const {
            data
          } = await this.$axios.get("/ambito");
          this.ambitos = data;
        } catch (error) {
          this.$toast.error("No se pudo cargar los ambitos.");
        }
      },

      async getEntidades() {
        try {
          const {
            data
          } = await this.$axios.get("/entidad/listar");
          this.entidades = data;
        } catch (error) {
          this.$toast.error("No se pudo cargar las entidades");
        }
      },

      async getContrato() {
        try {
          this.setPreload(true);
          const {
            data
          } = await this.$axios.get("/contrato/" + this.contrato_id)
          this.asignarData(data)
        } catch (error) {
          console.log(error)
        } finally {
          this.setPreload(false);
        }
      },

      async getTieneContrato(valor) {
        try {
          this.setPreload(true);
          const response = await this.$axios.get("/prestador/tiene-contrato/" + valor)
          return response.data
        } catch (error) {
          console.log(error);
        } finally {
          this.setPreload(false);
        }
      },

      async submit() {

        if (!this.validar()) {
          return;
        }

        const formData = new FormData();
        formData.append('prestador_id', this.form.prestador_id);
        formData.append('ambito_id', this.form.ambito_id);
        formData.append('fecha_termina', this.form.fecha_termina);
        formData.append('fecha_inicio', this.form.fecha_inicio);
        formData.append('descripcion', this.form.descripcion);
        formData.append('entidad_id', this.form.entidad_id);
        formData.append('pgp', this.form.pgp ? 1 : 0);
        formData.append('capitado', this.form.capitado ? 1 : 0);
        formData.append('evento', this.form.evento ? 1 : 0);
        formData.append('poliza', this.form.poliza ? 1 : 0);
        formData.append('renovacion', this.form.renovacion ? 1 : 0);
        formData.append('modificacion', this.form.evento ? 1 : 0);
        formData.append('tipo_reporte', this.form.tipo_reporte);
        formData.append('linea_negocio', this.form.linea_negocio);
        formData.append('regimen', this.form.regimen);
        formData.append('documento_proveedor_id', this.form.documento_proveedor_id);
        formData.append('documento_proveedor', this.form.documento_proveedor);
        formData.append('naturaleza_juridica', this.form.naturaleza_juridica);
        formData.append('codigo_habilitacion', this.form.codigo_habilitacion);
        formData.append('componente', this.form.componente);
        formData.append('tipo_servicio', this.form.tipo_servicio);
        formData.append('tipo_relacion', this.form.tipo_relacion);
        formData.append('codigo_contrato', this.form.codigo_contrato);
        formData.append('poblacion_cubierta', this.form.poblacion_cubierta);
        formData.append('modalidad_pago', this.form.modalidad_pago);
        formData.append('otra_modalidad', this.form.otra_modalidad);
        formData.append('obj_contrato', this.form.obj_contrato);
        formData.append('tipo_modificacion', this.form.tipo_modificacion);
        formData.append('valor_contrato', this.form.valor_contrato);
        formData.append('valor_adicion', this.form.valor_adicion);
        formData.append('valor_ejecutado', this.form.valor_ejecutado);
        formData.append('estado', this.form.estado);
        formData.append('union_temporal', this.form.union_temporal);
        formData.append('union_temporal_id', this.form.union_temporal_id);
        formData.append('tipo_proveedor', this.form.tipo_proveedor);
        formData.append('tipo_red', this.form.tipo_red);

        this.form.files.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });

        try {
          this.setPreload(true)
          if (this.editando) {
            //validamos que exista una novedad
            if (!this.form.novedad) {
              this.$swal({
                type: "error",
                title: "¡Ojo!",
                text: "Debe llenar la novedad con la información el cambio realizado",
              });
              return;
            }

            formData.append(`novedad`, this.form.novedad);
            await this.$axios.post("/contrato/" + this.contrato_id, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            this.$toast.success("El contrato se edito correctamente.");
            this.novedad = null;
            this.form.files = [];
            this.getContrato();
          } else {

            formData.append(`novedad`, 'Creacion de contrato');
            await this.$axios.post("/contrato", formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            this.$toast.success("El contrato se creo correctamente.");
            this.limpiar();

          }
        } catch (error) {
          console.log(error.response)
          if (error.response.status === 422) {
            console.log(error.response)
            this.pintarErrores(error.response.data)
            this.$toast.error("Error al crear el contrato.");
          }
        } finally {
          this.setPreload(false)
        }
      },

      /**
       * Esta funcion lo que hace es marcar una bandera
       * La bandera lo que hace es verificar si se debe de ejecutar el fetch o no, ya que con el change deberia no ejecutar de nuevo el watch
       */
      handleCambioPrestador() {
        this.bandera = false
      },

      pintarErrores(errores) {
        this.errores = []; // Reinicia el array de errores
        Object.values(errores).forEach(error => {
          if (Array.isArray(error)) {
            // Concatenamos los errores si son un array
            this.errores = this.errores.concat(error);
          } else {
            // Agrega el error si es un string
            this.errores.push(error);
          }
        });
      },


      asignarData(data) {
        this.form.fecha_inicio = this.$moment(data.fecha_inicio).format('YYYY-MM-DD');
        this.form.fecha_termina = this.$moment(data.fecha_termina).format('YYYY-MM-DD');
        this.form.ambito_id = data.ambito_id;
        this.form.entidad_id = data.entidad_id;
        this.form.prestador_id = data.prestador_id;
        this.form.descripcion = data.descripcion;
        this.form.pgp = data.pgp;
        this.form.capitado = data.capitado;
        this.form.evento = data.evento;
        this.form.novedad = data.novedad;
        this.form.poliza = data.poliza;
        this.form.renovacion = data.renovacion;
        this.form.modificacion = data.modificacion;
        this.form.tipo_reporte = data.tipo_reporte;
        this.form.linea_negocio = data.linea_negocio;
        this.form.regimen = data.regimen;
        this.form.documento_proveedor_id = data.documento_proveedor_id;
        this.form.documento_proveedor = data.documento_proveedor;
        this.form.naturaleza_juridica = data.naturaleza_juridica;
        this.form.codigo_habilitacion = data.codigo_habilitacion;
        this.form.componente = data.componente;
        this.form.tipo_servicio = data.tipo_servicio;
        this.form.tipo_relacion = data.tipo_relacion;
        this.form.codigo_contrato = data.codigo_contrato;
        this.form.obj_contrato = data.obj_contrato;
        this.form.poblacion_cubierta = data.poblacion_cubierta;
        this.form.modalidad_pago = data.modalidad_pago;
        this.form.otra_modalidad = data.otra_modalidad;
        this.form.tipo_modificacion = data.tipo_modificacion;
        this.form.valor_contrato = data.valor_contrato;
        this.form.valor_adicion = data.valor_adicion;
        this.form.valor_ejecutado = data.valor_ejecutado;
        this.form.estado = data.estado;
        this.form.union_temporal = data.union_temporal;
        this.form.union_temporal_id = data.union_temporal_id;
        this.form.tipo_proveedor = data.tipo_proveedor;
        this.form.tipo_red = data.tipo_red;
        this.novedades = data.novedades;
        this.adjuntos = data.adjuntos;
      },

      /**
       * limpia el form a su forma inicial
       */
      limpiar() {
        this.errores = [];
        this.form = {
          fecha_inicio: null,
          fecha_termina: null,
          files: [],
          ambito_id: null,
          entidad_id: null,
          prestador_id: null,
          descripcion: null,
          pgp: false,
          capitado: false,
          evento: false,
          novedad: null, // este es el adjunto
          poliza: false,
          renovacion: false,
          modificacion: false,
          tipo_reporte: null,
          linea_negocio: null,
          regimen: null,
          documento_proveedor_id: null,
          documento_proveedor: null,
          naturaleza_juridica: null,
          codigo_habilitacion: '',
          componente: null,
          tipo_servicio: null,
          tipo_relacion: null,
          codigo_contrato: null,
          obj_contrato: null,
          poblacion_cubierta: 0,
          modalidad_pago: null,
          otra_modalidad: null,
          tipo_modificacion: null,
          valor_contrato: 0,
          valor_adicion: 0,
          valor_ejecutado: 0,
          estado: null,
          union_temporal: null,
          union_temporal_id: null,
          tipo_proveedor: null,
          tipo_red: null
        }
        this.reset();
      },

      async abrirArchivo(ruta) {
        try {
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        } catch (error) {
          console.log(error.Response);
        }
      },

      /** valida que el formulario cumpla con los campos minimos requeridos */
      validar() {
        return this.$refs.form.validate()
      },

      reset() {
        this.$refs.form.resetValidation()
        this.errores = []
      },

      dialogoAdjuntos(item) {
        this.adjuntos = item.adjunto_novedad_contratos
        this.dialogAdjuntos = true
      }

    },
  }

</script>

<style scoped>
  .scrollable-timeline {
    max-height: 500px;
    /* Ajusta la altura máxima según tus necesidades */
    overflow-y: auto;
  }

</style>
