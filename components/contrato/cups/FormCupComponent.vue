<template>
  <div>
    <v-container fluid class="pa-0">
      <v-card>
        <v-card-title class="titulo black--text">{{ editar ? "Editar" : "Crear" }} Cup
        </v-card-title>
        <v-row no-gutters>
          <v-col cols="12" :sm="editar == false ? '12' : '7'" :md="editar == false ? '12' : '7'">
            <form>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="12" md="2">
                    <v-text-field outlined v-model="form.codigo" label="Codigo *" :error-messages="errors.codigo">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12" md="10">
                    <v-text-field outlined v-model="form.nombre" label="Nombre *" :error-messages="errors.nombre">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12" md="3">
                    <v-autocomplete :items="['A', 'F', 'M']" v-model="form.genero" label="Genero *"
                      :error-messages="errors.genero"></v-autocomplete>
                  </v-col>

                  <v-col cols="12" sm="12" md="2">
                    <v-text-field v-model="form.edad_inicial" type="number" label="Edad inicial *"
                      :error-messages="errors.edad_inicial"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12" md="2">
                    <v-text-field v-model="form.edad_final" type="number" label="Edad final *"
                      :error-messages="errors.edad_final"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12" md="2">
                    <v-autocomplete :items="['AC', 'AF', 'AP', 'AT']" v-model="form.archivo" label="Archivo *"
                      :error-messages="errors.archivo"></v-autocomplete>
                  </v-col>

                  <v-col cols="12" sm="12" md="3">
                    <v-select v-model="form.quirurgico" :items="siNo" item-text="nombre" item-value="value"
                      label="Quirurgico *" :error-messages="errors.quirurgico"></v-select>
                  </v-col>

                  <v-col cols="12" sm="12" md="4">
                    <v-autocomplete :items="ambitos" item-text="nombre" item-value="id" v-model="form.ambito_id"
                      label="Ambito *" :error-messages="errors.ambito_id" dense>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" sm="12" md="4">
                    <v-autocomplete v-model="form.modalidad_grupo_tec_sal_id"
                      label="Modalidad grupo tecnologia en salud" :items="modalidadesGrupo"
                      :item-text="(item) => `${item.codigo} - ${item.nombre}`" item-value="id" dense>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="4" sm="4">
                    <v-autocomplete v-model="form.grupo_servicio_id" label="Grupo servicio" dense
                      :items="grupoServicios" :item-text="(item) => `${item.codigo} - ${item.nomnbre}`" item-value="id">
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="5" sm="5">
                    <v-autocomplete v-model="form.codigo_servicio_id" label="Codigo de servicio" dense
                      :items="codigosServicios" :item-text="(item) => `${item.codigo} - ${item.nombre}`"
                      item-value="id">
                    </v-autocomplete>
                  </v-col>


                </v-row>

                <p>Campos obligatorios *</p>
              </v-card-text>
            </form>
            <v-card-actions class="justify-end">
              <v-btn color="error" @click="$emit('cerrar'), limpiar()">cerrar</v-btn>
              <v-btn color="boton" dark @click="submit()">Guardar</v-btn>
            </v-card-actions>

            <v-col cols="12" md="12" sm="12" v-if="editar">
              <v-alert dense text icon="mdi-cash" type="info">
                <b>Parametros Por Entidad</b>
              </v-alert>

              <v-card-text>
                <v-row>
                  <v-expansion-panels focusable>
                    <v-expansion-panel v-for="(item) in entidadCup" :key="item.id">
                      <v-expansion-panel-header>Entidad: {{item.nombre}}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <form>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="12" md="3">
                                <v-select v-model="item.diagnostico_requerido" :items="siNo" item-text="nombre"
                                  item-value="value" label="Diagnostico requerido *"
                                  :error-messages="errors.diagnostico_requerido"></v-select>
                              </v-col>

                              <v-col cols="12" sm="12" md="3">
                                <v-select :items="niveles_ordenamiento" v-model="item.nivel_ordenamiento"
                                  label="Nivel ordenamiento *" :error-messages="errors.nivel_ordenamiento"></v-select>
                              </v-col>

                              <v-col cols="12" sm="12" md="3">
                                <v-select :items="niveles_portabilidad" v-model="item.nivel_portabilidad"
                                  label="Nivel portabilidad *" :error-messages="errors.nivel_portabilidad"></v-select>
                              </v-col>

                              <v-col cols="12" sm="12" md="3">
                                <v-select v-model="item.requiere_auditoria" :items="siNo" item-text="nombre"
                                  item-value="value" label="Requiere auditoria *"
                                  :error-messages="errors.requiere_auditoria"></v-select>
                              </v-col>

                              <v-col cols="12" sm="12" md="3">
                                <v-text-field v-model="item.periodicidad" type="number" label="Periodocidad *"
                                  :error-messages="errors.periodicidad"></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="12" md="5">
                                <v-text-field v-model="item.cantidad_max_ordenamiento" type="number"
                                  label="Cantidad Maxima de ordenamiento *"
                                  :error-messages="errors.cantidad_max_ordenamiento">
                                </v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-row>
                                  <v-col cols="12" md="3">
                                    <v-checkbox v-model="item.copago" outlined label="Copago" color="primary"
                                      class="mt-0">
                                    </v-checkbox>
                                  </v-col>
                                  <v-col cols="12" md="3">
                                    <v-checkbox v-model="item.moderadora" outlined label="Cuota Moderadora"
                                      color="primary" class="mt-0"></v-checkbox>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                            <p>Campos obligatorios *</p>

                          </v-card-text>
                        </form>
                        <v-card-actions class="justify-end">
                          <v-btn color="boton" dense dark @click="guardarCupsEntidad(item)">Guardar</v-btn>
                        </v-card-actions>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-card-text>
            </v-col>
          </v-col>



          <v-col cols="5" md="5" v-if="editar">
            <v-container>
              <!-- Tarifa Vs Prestador -->
              <v-alert dense text icon="mdi-cash" type="info">
                <b>Tarifas Vs Prestador</b>
              </v-alert>

              <v-card class="mx-auto mb-5">
                <!-- Campo de búsqueda -->
                <v-text-field v-model="searchPrestador" solo label="Buscar por Prestador" append-icon="mdi-magnify"
                  dense hide-details clearable>
                </v-text-field>

                <!-- Espaciador -->
                <v-spacer></v-spacer>

                <v-card-text>
                  <v-virtual-scroll :items="filteredTarifasPrestadores" :item-height="60" height="400">
                    <template v-slot:default="{ item }">
                      <v-list-item>
                        <v-list-item-content>
                          <v-alert dense outlined color="black" type="info">
                            <strong>{{ item.prestador }}</strong> está con tarifa <strong>{{ item.tarifa }} {{
                    item.valorTarifa }}</strong> con un valor de <strong>$ {{ item.valor }}</strong> COP.
                          </v-alert>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-card-text>
              </v-card>

              <!-- Espaciador -->
              <v-spacer></v-spacer>

              <!-- Familias -->
              <v-alert dense text icon="mdi-cash" type="info">
                <b>Familias</b>
              </v-alert>

              <v-row>
                <v-col cols="12" v-for="(cupsFamilia, index) in cupsFamilias" :key="index">
                  <v-alert border="right" colored-border type="info" elevation="2">
                    El cups <strong>{{ cupsFamilia.CodigoNombre }}</strong> se encuentra en la familia
                    <strong>{{ cupsFamilia.familia_nombre }}</strong>.
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
          </v-col>


        </v-row>


        <!-- Preload -->
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
      </v-card>
    </v-container>
  </div>
</template>
<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can("blog.vista")) {
        return redirect("/");
      }
    },
    name: "FormCup",

    props: {
      editar: Boolean,
      cup_id: Number,
    },

    watch: {
      cup_id() {
        if (this.editar) {
          this.getCup();
        }
      },
    },

    data() {
      return {
        form: {
          nombre: null,
          codigo: null,
          genero: null,
          edad_inicial: null,
          edad_final: null,
          archivo: null,
          quirurgico: null,
          diagnostico_requerido: null,
          nivel_ordenamiento: null,
          nivel_portabilidad: '',
          requiere_auditoria: null,
          periodicidad: null,
          cantidad_max_ordenamiento: null,
          ambito_id: null,
          modalidad_grupo_tec_sal_id: null,
          grupo_servicio_id: null,
          codigo_servicio_id: null,
          copago: false,
          moderadora: false,
        },
        siNo: [{
            nombre: "Si",
            value: 1,
          },
          {
            nombre: "No",
            value: 0,
          },
        ],
        ambitos: [],
        searchPrestador: '',
        cupsFamilias: [],
        tarifasPrestadores: [],
        niveles_ordenamiento: [0, 1, 2, 3, 4],
        niveles_portabilidad: [0, 1, 2, 3, 4],
        grupoServicios: [],
        entidadCup: [],
        errors: {
          nombre: null,
          codigo: null,
          genero: null,
          edad_inicial: null,
          edad_final: null,
          archivo: null,
          quirurgico: null,
          diagnostico_requerido: null,
          nivel_ordenamiento: null,
          nivel_portabilidad: null,
          requiere_auditoria: null,
          periodicidad: null,
          cantidad_max_ordenamiento: null,
          ambito_id: null,
        },
        preload: null,
        modalidadesGrupo: [],
        codigosServicios: []
      };
    },

    computed: {
      // Filtra los resultados según el texto ingresado en el buscador
      filteredTarifasPrestadores() {
        if (!this.searchPrestador) {
          return this.tarifasPrestadores;
        }
        return this.tarifasPrestadores.filter((item) =>
          item.prestador.toLowerCase().includes(this.searchPrestador.toLowerCase())
        );
      },
    },

    mounted() {
      this.listarModalidadesGrupo()
      if (this.editar) {
        this.getCup();
      }
      this.listarGrupoServicios();
      this.listarCodigosServicio()
      this.getAmbitos();
    },

    methods: {
      async submit() {
        try {
          this.limpiarError();
          const request = {
            nombre: this.form.nombre,
            codigo: this.form.codigo,
            genero: this.form.genero,
            edad_inicial: this.form.edad_inicial,
            edad_final: this.form.edad_final,
            archivo: this.form.archivo,
            quirurgico: this.form.quirurgico,
            diagnostico_requerido: this.form.diagnostico_requerido,
            nivel_ordenamiento: this.form.nivel_ordenamiento,
            nivel_portabilidad: this.form.nivel_portabilidad,
            requiere_auditoria: this.form.requiere_auditoria,
            periodicidad: this.form.periodicidad,
            cantidad_max_ordenamiento: this.form.cantidad_max_ordenamiento,
            ambito_id: this.form.ambito_id,
            modalidad_grupo_tec_sal_id: this.form.modalidad_grupo_tec_sal_id,
            grupo_servicio_id: this.form.grupo_servicio_id,
            codigo_servicio_id: this.form.codigo_servicio_id,
            copago: this.form.copago,
            moderadora: this.form.moderadora,
          };
          if (this.editar) {
            await this.$axios.put("/cup/" + this.cup_id, request);
            this.$toast.success("El cup se edito correctamente.");
          } else {
            await this.$axios.post("/cup", request);
            this.$toast.success("El cup se creo correctamente.");
          }
          this.limpiar();
          this.$emit("submit");
          this.$emit("cerrar");
        } catch (error) {
          console.log(error);
          this.ErrorEntrada(error.response.data);
        }
      },

      async getCup() {
        this.preload = true;
        const params = {
          cup_id: this.cup_id,
        };
        await this.$axios
          .get("/cup/consultar", {
            params: params
          })
          .then((res) => {
            this.preload = false;
            if (res.data.length > 0) {
              const cupData = res.data[0];
              this.form.nombre = cupData.nombre;
              this.form.codigo = cupData.codigo;
              this.form.genero = cupData.genero;
              this.form.edad_inicial = cupData.edad_inicial;
              this.form.edad_final = cupData.edad_final;
              this.form.archivo = cupData.archivo;
              this.form.quirurgico = cupData.quirurgico ? 1 : 0;
              this.form.diagnostico_requerido = cupData.diagnostico_requerido ? 1 : 0;
              this.form.copago = cupData.copago ? 1 : 0;
              this.form.moderadora = cupData.moderadora ? 1 : 0;
              this.form.nivel_ordenamiento = cupData.nivel_ordenamiento;
              this.form.nivel_portabilidad = cupData.nivel_portabilidad;
              this.form.requiere_auditoria = cupData.requiere_auditoria ? 1 : 0;
              this.form.periodicidad = cupData.periodicidad;
              this.form.cantidad_max_ordenamiento = cupData.cantidad_max_ordenamiento;
              this.form.ambito_id = cupData.ambito_id;
              this.form.modalidad_grupo_tec_sal_id = cupData.modalidad_grupo_tec_sal_id,
                this.form.grupo_servicio_id = cupData.grupo_servicio_id,
                this.form.codigo_servicio_id = cupData.codigo_servicio_id
              this.consultarFamilia();
              this.cupTarifa();
              this.getEntidadCup();
            }
          })
          .catch((error) => {
            this.preload = false;
            console.log(error.response);
          });
      },


      limpiar() {
        (this.form.nombre = null),
        (this.form.codigo = null),
        (this.form.genero = null),
        (this.form.edad_inicial = null),
        (this.form.edad_final = null),
        (this.form.archivo = null),
        (this.form.quirurgico = null),
        (this.form.diagnostico_requerido = null),
        (this.form.nivel_ordenamiento = null),
        (this.form.requiere_auditoria = null),
        (this.form.periodicidad = null),
        (this.form.ambito_id = null),
        (this.form.modalidad_grupo_tec_sal_id = null),
        (this.form.grupo_servicio_id = null),
        (this.form.codigo_servicio_id = null),
        this.cupsFamilias = []
        this.limpiarError();
      },

      async getAmbitos() {
        try {
          const response = await this.$axios.get("/ambito");
          this.ambitos = response.data;
        } catch (error) {}
      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(",");
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = "";
        }
      },
      consultarFamilia() {
        this.preload = true;
        const params = {
          nombreCups: this.form.codigo,
        };
        this.$axios.post("/familia/cups", params).then(res => {
          this.preload = false
          this.cupsFamilias = res.data
        }).catch(error => {
          this.preload = false
        })
      },

      cupTarifa() {
        this.preload = true;
        const params = {
          cup_id: this.cup_id
        }
        this.$axios.post("/cup/tarbuscarCupsNombreifasPrestador", params).then(res => {
          this.preload = false
          this.tarifasPrestadores = res.data
          console.log(this.tarifasPrestadores)
        }).catch(error => {
          this.preload = false
        })
      },

      listarModalidadesGrupo() {
        this.$axios.get('modalidadgrupoTec/listar').then(res => {
          this.modalidadesGrupo = res.data
        }).catch(error => {
          this.$toast.error('Error al listar las modalides de grupo de tecnologia en salud')
        })
      },

      listarGrupoServicios() {
        this.$axios.get('grupoServicios/listar').then(res => {
          this.grupoServicios = res.data
        }).catch(error => {
          this.$toast.error('Error al listar los grupos de servicios', error)
        })
      },

      listarCodigosServicio() {
        this.$axios.get('codigoServicio/listar').then(res => {
          this.codigosServicios = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      getEntidadCup() {
        this.preload = true;
        this.$axios.get("/cup/obtenerEntidades/" + this.cup_id).then(res => {
          this.preload = false
          this.entidadCup = res.data
        }).catch(error => {
          this.preload = false
        })
      },

      async guardarCupsEntidad(item) {
        try {
          this.preload = true;
          const request = {
            diagnostico_requerido: item.diagnostico_requerido,
            nivel_ordenamiento: item.nivel_ordenamiento,
            nivel_portabilidad: item.nivel_portabilidad,
            requiere_auditoria: item.requiere_auditoria,
            periodicidad: item.periodicidad,
            cantidad_max_ordenamiento: item.cantidad_max_ordenamiento,
            copago: item.copago,
            moderadora: item.moderadora,
            cup_entidad_id: item.cup_entidad_id,
            entidad_id: item.id
          };
          await this.$axios.post("/cup/guardar-parametros", request);
          this.$toast.success("Los parametros se guardaron correctamente.");
          this.getEntidadCup();
          this.preload = false;
        } catch (error) {
          this.preload = false;
          this.$toast.error("Los parametros no se guardaron correctamente.");
        }
      }

    },
  };

</script>
