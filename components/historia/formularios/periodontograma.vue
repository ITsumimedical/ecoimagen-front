<template>
  <div>
    <v-dialog v-model="dialogConsulta" width="1000">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Diagnosticos y Procedimientos
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="12" md="4">
                <v-select v-model="filtoTipo" label="Tipo" :items="['Diagnostico','Procedimiento']"></v-select>
              </v-col> -->
              <v-col cols="12" md="12">
                <v-text-field v-model="busqueda" label="Nombre"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-data-table :search="busqueda" :headers="headersElementos" :items="elementos" item-key="id"
            class="elevation-1" hide-default-footer disable-pagination>
            <template v-slot:item.color="{ item }">
              <td>
                <div :style="'background:'+item.color+';width:20px;height:20px;'"></div>
              </td>
            </template>
            <template v-slot:item.accion="{ item }">
              <v-btn color="success" icon @click="asignarElemento(item)">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark @click="dialogConsulta = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="12" sm="12" md="12">
      <v-alert border="left" class="text-center" dense text type="info" icon="mdi-medication">
        <b>ODONTOGRAMA</b>
      </v-alert>
    </v-col>
    <!--    <v-container>-->
    <!--      <v-row>-->
    <!--        <v-col cols="12" sm="12" md="12">-->
    <v-tabs fixed-tabs>
      <v-tab>ODONTOGRAMA DIAGNOSTICO</v-tab>
      <v-tab>ODONTOGRAMA TRATAMIENTO</v-tab>
      <v-tab-item ref="odontogramaElemento">
        <v-col v-for="(fila,index) in filas" cols="12" sm="12" md="12" :key="index">
          <v-card class="d-flex justify-center" flat tile>
            <li v-for="pieza in fila" :key="pieza">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <h2><b>{{ pieza }}</b>
                    <v-btn v-on="on" @click="limpiarDiente(pieza,'diagnostico')" x-small icon color="info">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </h2>
                </template>
                <span>Limpiar Diente</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
              <div v-on="on" :ref="`${pieza}_5`" :class="[`cara-pieza-externa-arriba`,{'active': isActive(`${pieza}_5`)}]" @click="SeleccionarPieza(pieza,'5','diagnostico')">
                <template v-if="eventos.hasOwnProperty(pieza+'_5') && eventos[pieza+'_5'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente').length > 0">
                  <template v-for="evento in eventos[pieza+'_5'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente')">
                    <div class="sobrecara-arriba" :style="'color:'+evento.color">{{evento.caracter}}</div>
                  </template>
                </template>
                <template v-else>
                  <div v-for="evento in eventos[pieza+'_5']" :style="'background: '+evento.color+';height: 100%;width: '+(100/eventos[pieza+'_5'].length)+'%'"></div>
                </template>

              </div>
              </template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Diagnostico
                        </th>
                        <th class="text-center">
                          Superficie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr
                      v-for="item in eventos[pieza+'_5']" :key="item.id">
                      <td>{{ item.descripcion }}</td>
                      <td>
                        <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                        <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tooltip>
              <div class="pieza_completa">
                <template v-for="cara in [0,1,2,3,4]">

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-on="on" :ref="`${pieza}_${cara}`" @click="SeleccionarPieza(pieza,cara,'diagnostico')"
                           :class="[`cara-pieza cara-pieza__${cara}`,{'active': isActive(`${pieza}_${cara}`)}]"
                           role="button" @mouseover="caraTooltip = `${pieza}_${cara}`" @mouseleave="caraTooltip = ''">
                        <template v-if="eventos.hasOwnProperty(pieza+'_'+cara) && eventos[pieza+'_'+cara].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente').length > 0">
                          <template v-for="evento in eventos[pieza+'_'+cara].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente')">
                            <div class="sobrecara" :style="'color:'+evento.color">{{evento.caracter}}</div>
                          </template>
                        </template>
                        <template v-else-if="parseInt(cara) === 0 || parseInt(cara) === 3">
                          <div class="elementos">
                            <template v-for="evento in eventos[pieza+'_'+cara]">
                              <div
                                :style="'background: '+evento.color+';width: 100%;height: '+(100/eventos[pieza+'_'+cara].length)+'%'">
                              </div>
                            </template>
                          </div>
                        </template>
                        <template v-else-if="parseInt(cara) === 1 || parseInt(cara) === 2">
                          <div class="elementos2">
                            <template v-for="evento in eventos[pieza+'_'+cara]">
                              <div
                                :style="'background: '+evento.color+';width: 100%;height: '+(100/eventos[pieza+'_'+cara].length)+'%'">
                              </div>
                            </template>
                          </div>
                        </template>
                        <template v-else>
                          <div class="cara-pieza cara-pieza__4_2">
                            <div class="elementos3">
                              <template v-for="evento in eventos[pieza+'_'+cara]">
                                <div
                                  :style="'background: '+evento.color+';width: 100%;height: '+(100/eventos[pieza+'_'+cara].length)+'%'">
                                </div>
                              </template>
                            </div>
                          </div>


                          <div class="cara-pieza-2 cara-pieza__4"
                            v-if="eventos.hasOwnProperty(pieza+'_diente') && eventos[pieza+'_diente'].length > 0">
                            <template v-for="evento in eventos[pieza+'_diente']">
                              <div class="letra" :style="estiloLetra+evento.color+';'">{{evento.caracter}}</div>
                            </template>
                            <div class="sobrecara">-</div>
                          </div>
                        </template>

                      </div>
                    </template>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              Diagnostico
                            </th>
                            <th class="text-center">
                              Superficie
                            </th>
                          </tr>
                        </thead>
                        <tbody>

                          <tr v-for="item in eventos[pieza+'_diente']" :key="item.id">
                            <td>{{ item.descripcion }}</td>
                            <td>
                              <div :style="'color: '+item.color+';width: 20px;height: 20px'">{{item.caracter}}</div>
                            </td>
                          </tr>

                        <tr v-for="item in eventos[pieza+'_'+cara]" :key="item.id">
                          <td>{{ item.descripcion }}</td>
                          <td>
                            <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                            <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                          </td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-tooltip>
                </template>
              </div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
              <div v-on="on" :ref="`${pieza}_6`" :class="[`cara-pieza-externa-abajo`,{'active': isActive(`${pieza}_6`)}]" @click="SeleccionarPieza(pieza,'6','diagnostico')">
                <template v-if="eventos.hasOwnProperty(pieza+'_6') && eventos[pieza+'_6'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente').length > 0">
                  <template v-for="evento in eventos[pieza+'_6'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente')">
                    <div class="sobrecara-abajo" :style="'color:'+evento.color">{{evento.caracter}}</div>
                  </template>
                </template>
                <template v-else>
                  <div v-for="evento in eventos[pieza+'_6']"
                       :style="'background: '+evento.color+';height: 100%;width: '+(100/eventos[pieza+'_6'].length)+'%'"></div>
                </template>
              </div>
              </template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Diagnostico
                        </th>
                        <th class="text-center">
                          Superficie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr
                      v-for="item in eventos[pieza+'_6']" :key="item.id">
                      <td>{{ item.descripcion }}</td>
                      <td>
                        <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                        <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-on="on" class="figuras">
                    <template v-for="evento in eventos[pieza+'_afuera']">
                      <div :style="'color:'+evento.color+';width: 22px;height: 15px;'">{{ evento.caracter }}</div>
                    </template>
                  </div>
                </template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Diagnostico
                        </th>
                        <th class="text-center">
                          Superficie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in eventos[pieza+'_afuera']" :key="item.id">
                        <td>{{ item.descripcion }}</td>
                        <td>
                          <div :style="'color: '+item.color+';width: 20px;height: 20px'">{{item.caracter}}</div>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tooltip>
            </li>
          </v-card>
        </v-col>
      </v-tab-item>




      <v-tab-item ref="odontogramaElemento">
        <v-col v-for="(fila,index) in filas" cols="12" sm="12" md="12" :key="index">
          <v-card class="d-flex justify-center" flat tile>
            <li v-for="pieza in fila" :key="pieza">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <h2><b>{{ pieza }}</b>
                    <v-btn v-on="on" @click="limpiarDiente(pieza,'tratamiento')" x-small icon color="info">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </h2>
                </template>
                <span>Limpiar Diente</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
              <div v-on="on" :ref="`${pieza}_5`" :class="[`cara-pieza-externa-arriba`,{'active': isActive(`${pieza}_5`)}]"
                   @click="SeleccionarPieza(pieza,'5','tratamiento')">
                <template v-if="eventosTratamiento.hasOwnProperty(pieza+'_5') && eventosTratamiento[pieza+'_5'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente').length > 0">
                  <template v-for="evento in eventosTratamiento[pieza+'_5'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente')">
                    <div class="sobrecara-arriba" :style="'color:'+evento.color">{{evento.caracter}}</div>
                  </template>
                </template>
                <template v-else>
                  <div v-for="evento in eventosTratamiento[pieza+'_5']" :style="'background: '+evento.color+';height: 100%;width: '+(100/eventosTratamiento[pieza+'_5'].length)+'%'"></div>
                </template>
              </div>
              </template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Diagnostico
                        </th>
                        <th class="text-center">
                          Superficie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in eventosTratamiento[pieza+'_5']" :key="item.id">
                      <td>{{ item.descripcion }}</td>
                      <td>
                        <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                        <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                      </td>
                    </tr>
                    <tr v-for="item in historicoTratamientos[pieza+'_5']" :key="item.id">
                      <td>{{ item.descripcion }}</td>
                      <td>
                        <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                        <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tooltip>
              <div class="pieza_completa">
                <template v-for="cara in [0,1,2,3,4]">

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-on="on" :ref="`${pieza}_${cara}`" @click="SeleccionarPieza(pieza,cara,'tratamiento')"
                           :class="[`cara-pieza cara-pieza__${cara}`,{'active': isActive(`${pieza}_${cara}`)}]"
                           role="button" @mouseover="caraTooltip = `${pieza}_${cara}`" @mouseleave="caraTooltip = ''">
                        <template v-if="eventosTratamiento.hasOwnProperty(pieza+'_'+cara) && eventosTratamiento[pieza+'_'+cara].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente').length > 0">
                          <template v-for="evento in eventosTratamiento[pieza+'_'+cara].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente')">
                            <div class="sobrecara" :style="'color:'+evento.color">{{evento.caracter}}</div>
                          </template>
                        </template>
                        <template v-else-if="parseInt(cara) === 0 || parseInt(cara) === 3">
                          <div class="elementos">
                            <template v-for="evento in eventosTratamiento[pieza+'_'+cara]">
                              <div
                                :style="'background: '+evento.color+';width: 100%;height: '+(100/eventosTratamiento[pieza+'_'+cara].length)+'%'">
                              </div>
                            </template>
                          </div>
                        </template>
                        <template v-else-if="parseInt(cara) === 1 || parseInt(cara) === 2">
                          <div class="elementos2">
                            <template v-for="evento in eventosTratamiento[pieza+'_'+cara]">
                              <div
                                :style="'background: '+evento.color+';width: 100%;height: '+(100/eventosTratamiento[pieza+'_'+cara].length)+'%'">
                              </div>
                            </template>
                          </div>
                        </template>
                        <template v-else>
                          <div class="cara-pieza cara-pieza__4_2">
                            <div class="elementos3">
                              <template v-for="evento in eventosTratamiento[pieza+'_'+cara]">
                                <div
                                  :style="'background: '+evento.color+';width: 100%;height: '+(100/eventosTratamiento[pieza+'_'+cara].length)+'%'">
                                </div>
                              </template>
                            </div>
                          </div>
                        </template>

                      </div>
                    </template>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              Diagnostico
                            </th>
                            <th class="text-center">
                              Superficie
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in eventosTratamiento[pieza+'_'+cara]" :key="item.id">
                          <td>{{ item.descripcion }}</td>
                          <td>
                            <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                            <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                          </td>
                        </tr>
                        <tr v-for="item in historicoTratamientos[pieza+'_'+cara]" :key="item.id">
                          <td>{{ item.descripcion }}</td>
                          <td>
                            <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                            <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                          </td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-tooltip>
                </template>
              </div>


              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-on="on" :ref="`${pieza}_6`"
                       :class="[`cara-pieza-externa-abajo`,{'active': isActive(`${pieza}_6`)}]"
                       @click="SeleccionarPieza(pieza,'6','tratamiento')">
                    <template v-if="eventosTratamiento.hasOwnProperty(pieza+'_6') && eventosTratamiento[pieza+'_6'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente').length > 0">
                      <template v-for="evento in eventosTratamiento[pieza+'_6'].filter(s => s.identificador === 'Caracter' && s.posicion === 'Seccion Diente')">
                        <div class="sobrecara-abajo" :style="'color:'+evento.color">{{evento.caracter}}</div>
                      </template>
                    </template>
                    <template v-else>
                      <div v-for="evento in eventosTratamiento[pieza+'_6']"
                           :style="'background: '+evento.color+';height: 100%;width: '+(100/eventosTratamiento[pieza+'_6'].length)+'%'"></div>
                    </template>
                  </div>
                </template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Diagnostico
                        </th>
                        <th class="text-center">
                          Superficie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr
                      v-for="item in eventosTratamiento[pieza+'_6']" :key="item.id">
                      <td>{{ item.descripcion }}</td>
                      <td>
                        <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                        <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                      </td>
                    </tr>
                    <tr
                      v-for="item in historicoTratamientos[pieza+'_6']" :key="item.id">
                      <td>{{ item.descripcion }}</td>
                      <td>
                        <div v-if="item.caracter" :style="'color: '+item.color+''">{{item.caracter}}</div>
                        <div v-else :style="'background: '+item.color+';width: 20px;height: 20px'"></div>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-on="on" class="figuras">
                    <template v-for="evento in eventosTratamiento[pieza+'_afuera']">
                      <div :style="'color:'+evento.color+';width: 22px;height: 15px;'">{{ evento.caracter }}</div>
                    </template>
                  </div>
                </template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Diagnostico
                        </th>
                        <th class="text-center">
                          Superficie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in eventosTratamiento[pieza+'_afuera']" :key="item.id">
                        <td>{{ item.descripcion }}</td>
                        <td>
                          <div :style="'color: '+item.color+';width: 20px;height: 20px'">{{item.caracter}}</div>
                        </td>
                      </tr>
                      <tr v-for="item in historicoTratamientos[pieza+'_afuera']" :key="item.id">
                        <td>{{ item.descripcion }}</td>
                        <td>
                          <div :style="'color: '+item.color+';width: 20px;height: 20px'">{{item.caracter}}</div>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tooltip>


            </li>
          </v-card>
        </v-col>

      </v-tab-item>
    </v-tabs>
    <!--        </v-col>-->


    <v-col cols="12" sm="12" md="12" class="text-center">
      <v-btn color="success" small dark @click="guardarOdontograma">GUARDAR ODONTOGRAMA</v-btn>
    </v-col>

    <v-col v-if="Object.keys(eventos).length > 0">
        <calculoCop :datos="datos" ref="refCop"></calculoCop>
    </v-col>
    <!--      </v-row>-->
    <!--    </v-container>-->
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import calculoCop from "@/components/historia/formularios/calculoCopCeoComponente.vue"

  export default {
    props: ['datos', 'resumen'],
    components: {
        calculoCop
    },
    data() {
      return {
        tipoOdontograma: null,
        caraTooltip: '',
        desserts: [{
            name: 'Frozen Yogurt',
            calories: 159,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
          }
        ],
        caraSeleccionada: null,
        filtoTipo: 'Diagnostico',
        elementos: [],
        busqueda: '',
        dialogConsulta: false,
        eventos: {},
        eventosTratamiento: {},
        historicoTratamientos: {},
        filas: [
          [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
          [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
          [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
          [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
        ],
        piezas_seleccionadas: [],
        dialog: false,
        headersElementos: [{
            text: 'Descripcion',
            align: 'start',
            value: 'descripcion',
            groupable: false,
          },
          {
            text: 'Color',
            value: 'color',
            align: 'left'
          },
          {
            text: 'Posicion',
            value: 'posicion',
            align: 'left'
          },
          {
            text: 'Simbolo',
            value: 'caracter',
            align: 'left'
          },
          {
            text: '',
            value: 'accion',
            align: 'center'
          },
        ],
        estiloLetra: "position: absolute;text-align: center;width: 65px;height: 90px;margin-top: -48px;margin-left: -35px;font-family: Arial, Helvetica, sans-serif;font-size: 90px;-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);-ms-transform: rotate(-45deg);-o-transform: rotate(-45deg);transform: rotate(-45deg);-webkit-transition: box-shadow .3s ease-in-out;-moz-transition: box-shadow .3s ease-in-out;transition: box-shadow .3s ease-in-out;color:"
      }
    },
    methods: {
      listarProcesos() {
        this.$axios.get('odontograma/listar').then(res => {
          this.elementos = res.data
        }).catch(e => {
          this.$toast.error(e.response.mensaje);
          console.log(e.response)
        }).finally()
      },
      listarOdontograma() {
        this.$axios.get('odontograma/listar-odontograma/' + this.datos.id).then(res => {
          this.eventos = res.data.diagnosticos;
          this.eventosTratamiento = res.data.tratamientos
          this.historicoTratamientos = res.data.historicoTratamientos;
        }).catch(e => {
          this.$toast.error(e.response.mensaje);
          console.log(e.response)
        }).finally()
      },
      isActive(value) {
        return this.piezas_seleccionadas.includes(value)
      },
      SeleccionarPieza(pieza, cara, tipo) {
        this.dialogConsulta = true;
        let referencia = `${pieza}_${cara}`
        let selecionada = this.piezas_seleccionadas.includes(referencia)
        if (selecionada) {
          return this.piezas_seleccionadas.splice(this.piezas_seleccionadas.indexOf(referencia), 1)
        }
        // this.piezas_seleccionadas.push(`${pieza}_${cara}`);
        this.caraSeleccionada = `${pieza}_${cara}`;
        this.tipoOdontograma = tipo;
      },
      asignarElemento(item) {
        let cara = this.caraSeleccionada;
        if (item.posicion === 'Fuera') {
          const diente = cara.split('_');
          cara = diente[0] + '_afuera';
        }
        if (item.posicion === 'Diente') {
          const diente = cara.split('_');
          cara = diente[0] + '_diente';
        }
        if (this.tipoOdontograma === 'diagnostico') {
          if (!this.eventos.hasOwnProperty(cara)) {
            this.eventos[cara] = [];
          }
          this.eventos[cara].push(item);
        } else {
          if (!this.eventosTratamiento.hasOwnProperty(cara)) {
            this.eventosTratamiento[cara] = [];
          }
          this.eventosTratamiento[cara].push(item);
        }
        this.dialogConsulta = false;
      },
      async guardarOdontograma() {
        try {
            const data = {
            diagnosticos: {
                ...this.eventos,
            },
            tratamientos: {
                ...this.eventosTratamiento,
            },
            };

            const res = await this.$axios.post('odontograma/guardar/' + this.datos.id, data);
            this.$toast.success(res.data.mensaje);
            this.$refs.refCop.calcularCopCeo();
            this.$refs.refCop.calcularInforme202();

            await this.$nextTick();

            const odontogramaComponent = this.$refs.odontogramaElemento;

            const odontogramaElement = odontogramaComponent?.$el;
            if (!odontogramaElement || !(odontogramaElement instanceof HTMLElement)) {
            throw new Error("El componente odontograma no está presente o no es un elemento válido.");
            }

            const canvas = await html2canvas(odontogramaElement, {
            backgroundColor: "white",
            });

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));

            if (!blob) {
            this.$toast.error("No se pudo generar la imagen del odontograma.");
            return;
            }

            const formData = new FormData();
            formData.append("imagen", blob, "odontograma.jpg");
            formData.append("consulta_id", this.datos.id);
            formData.append("tipo", this.filtoTipo);

            const guardarImagenResponse = await this.$axios.post("odontograma/guardarImagen", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            });

            if (guardarImagenResponse.data && guardarImagenResponse.data.consulta_id) {
            this.$toast.success("Odontograma guardado exitosamente con imagen.");
            } else {
            this.$toast.error("Hubo un problema al guardar la imagen del odontograma.");
            }
        } catch (error) {
            console.error("Error al guardar el odontograma:", error);
            this.$toast.error("Hubo un problema al guardar el odontograma.");
        }
    },
      limpiarDiente(pieza, tipo) {
        const elementos = ['_0', '_1', '_2', '_3', '_4', '_5', '_6', '_afuera', '_diente']
        if (tipo === 'diagnostico') {
          elementos.forEach(e => {
            this.eventos[pieza + e] = [];
          })
        } else {
          elementos.forEach(e => {
            this.eventosTratamiento[pieza + e] = [];
          })
        }
      }
    },
    mounted() {
      this.listarProcesos();
      this.listarOdontograma();
    }
  }

</script>

<style scoped>
  body {
    margin: 20px;
  }

  i {
    margin-right: 5px;
  }

  .active {
    background-color: #41b883 !important;
  }


  .pieza_completa {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transition: box-shadow .3s ease-in-out;
    -moz-transition: box-shadow .3s ease-in-out;
    transition: box-shadow .3s ease-in-out;
    position: relative;
    border: 2px solid #35495e;
    border-radius: 250%;
    width: 60px;
    height: 60px;
    overflow: hidden;
    font-size: 0;
    box-sizing: content-box;
    margin: 1px;
  }


  li {
    display: inline-block;
    box-sizing: content-box;
  }

  .cara-pieza {
    display: inline-block;
    box-sizing: content-box;
    border: 1px solid #35495e;
    background-color: #fff;
    width: 28px;
    height: 28px;
  }

  .cara-pieza-2 {
    display: inline-block;
    box-sizing: content-box;
    border: 0px solid #35495e;
    width: 28px;
    height: 28px;
  }

  .elementos {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transition: box-shadow .3s ease-in-out;
    -moz-transition: box-shadow .3s ease-in-out;
    transition: box-shadow .3s ease-in-out;
    width: 38px;
    height: 38px;
  }

  .elementos2 {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transition: box-shadow .3s ease-in-out;
    -moz-transition: box-shadow .3s ease-in-out;
    transition: box-shadow .3s ease-in-out;
    width: 38px;
    height: 38px;
    margin-left: -10px;
  }


  .elementos3 {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transition: box-shadow .3s ease-in-out;
    -moz-transition: box-shadow .3s ease-in-out;
    transition: box-shadow .3s ease-in-out;
    width: 28px;
    height: 28px;
  }

  .cara-pieza:hover {
    background-color: #41b883;
  }

  .cara-pieza__0,
  .cara-pieza__1 {
    border-top: 1px solid #fff !important;
    z-index: 1;
    overflow: hidden;
  }

  .cara-pieza__0,
  .cara-pieza__2 {
    border-left: 1px solid #fff !important;
    z-index: 1;
    overflow: hidden;
  }

  .cara-pieza__1,
  .cara-pieza__3 {
    border-right: 1px solid #fff !important;
    z-index: 1;
    overflow: hidden;
  }

  .cara-pieza__2,
  .cara-pieza__3 {
    border-bottom: 1px solid #fff !important;
    z-index: 1;
    overflow: hidden;
  }

  .cara-pieza__4 {
    position: absolute;
    top: 45%;
    left: 45%;
    transform: translate(-40%, -40%);
    border-radius: 50%;
  }

  .cara-pieza__4_2 {
    overflow: hidden;
    position: absolute;
    top: 48%;
    left: 48%;
    transform: translate(-47%, -47%);
    border-radius: 50%;
    border: 0px solid #35495e;
  }

  .cara-pieza-externa-arriba {
    display: flex;
    box-sizing: content-box;
    border: 2px solid #35495e;
    height: 25px;
    width: 50px;
    border-top-left-radius: 30% 100%;
    border-top-right-radius: 30% 100%;
    margin-left: 6px;
    margin-bottom: -15px;
    overflow: hidden;

  }

  .cara-pieza-externa-abajo {
    display: flex;
    box-sizing: content-box;
    border: 2px solid #35495e;
    height: 25px;
    width: 50px;
    border-bottom-left-radius: 30% 100%;
    border-bottom-right-radius: 30% 100%;
    margin-top: -15px;
    margin-left: 6px;
    overflow: hidden;
  }

  .cara-pieza-externa-arriba:hover {
    background-color: #41b883;
  }

  .cara-pieza-externa-abajo:hover {
    background-color: #41b883;
  }

  .interno {
    background: red;
    width: 100%;
    height: 25%
  }

  .externo {
    background: red;
    width: 25%;
    height: 100%
  }

  .figuras {
    display: flex;
    /*   border: 2px solid #35495e; */
    width: 65px;
    height: 15px;
  }

  .figura {
    color: red;
    /*   border: 1px solid #35495e; */
    width: 15px;
    height: 15px;
  }

.sobrecara{
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transition: box-shadow .3s ease-in-out;
  -moz-transition: box-shadow .3s ease-in-out;
  transition: box-shadow .3s ease-in-out;
  box-sizing: content-box;
  /*   border: 0px solid #35495e; */
  /*   background-color: #fff; */
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items:center;
  font-size:30px;
  font-family: Arial, Helvetica, sans-serif;
  overflow: hidden;
  display: flex;
  margin-top: 5px;
  margin-left: 5px
}

.sobrecara-abajo{
  margin-top:12px;
  width: 48px;
  height: 28px;
  justify-content: center;
  align-items:center;
  font-size:30px;
  font-family: Arial, Helvetica, sans-serif;
  overflow: hidden;
  display: flex;
}

.sobrecara-arriba{
  width: 48px;
  height: 28px;
  justify-content: center;
  align-items:center;
  font-size:30px;
  font-family: Arial, Helvetica, sans-serif;
  overflow: hidden;
  display: flex;
}

</style>
