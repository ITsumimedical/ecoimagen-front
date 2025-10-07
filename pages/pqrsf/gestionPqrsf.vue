<template>

    <!-- opciones -->
    <v-tabs centered color="white" icons-and-text>
      <v-tabs-slider color="primary"></v-tabs-slider>
      
      <v-tab href="#tab-1" class="black--text">
        Mi Gestión
        <v-icon color="black">mdi-clipboard-text</v-icon>
      </v-tab>

      <v-tab href="#tab-2" class="black--text">
        Gestión Externa
        <v-icon color="black">mdi-web</v-icon>
      </v-tab>
  
      <v-tab href="#tab-3" class="black--text">
        Gestión Interna
        <v-icon color="black">mdi-inbox-arrow-down</v-icon>
      </v-tab>

  
      <!-- opcion 1 -->
      <v-tab-item :value="'tab-1'">
        <v-card flat>
          <v-card>
            <v-card-title>
  
              <!-- prioridad de colores -->
              <v-layout row wrap>
                <span>
                  Prioridad:
                </span>
                <span>
                  <v-icon color="error">mdi-checkbox-marked-circle-outline</v-icon> Alta
                </span>
                <span>
                  <v-icon color="yellow">mdi-checkbox-marked-circle-outline</v-icon> Media
                </span>
                <span>
                  <v-icon color="success">mdi-checkbox-marked-circle-outline</v-icon> Baja
                </span>
              </v-layout>
  
              <!-- filtro -->
              <!-- <v-autocomplete v-model="estado" :items="['Pendiente', 'Gestionado', 'Cierre Temporal']" label="Estado"
                single-line @input="getAsignadas()" :disabled="loading"></v-autocomplete>
              <v-spacer></v-spacer> -->
  
              <!-- busqueda -->
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
              </v-text-field>
  
            </v-card-title>
  
            <!-- tabala de pendientes -->
            <v-data-table :headers="headerMiGestion" :items="Filterdays" :search="search" item-key="index"
              :loading="loading" loading-text="Cargando..." no-data-text="No hay información para mostrar"
              hide-default-footer>
  
              <!-- icono de respuestas  -->
              <template v-slot:[`item.respuesta`]="{ item }">
                <v-badge color="primary" left v-model="showrespuestas">
                  <template v-slot:badge v-if="item.respuesta.length > 0">
                    <span>{{ item.respuesta.length }}</span>
                  </template>
                  <template v-slot:badge v-else>
                    <span>{{ 0 }}</span>
                  </template>
                  <v-icon>mdi-alarm-multiple</v-icon>
                </v-badge>
              </template>
  
              <!-- chip de tiempo cumplido -->
              <template v-slot:[`item.Cantdays`]="{ item }">
                <v-chip v-show="item.estado.nombre !== 'Cerrado temporal'" :class="ColorTd(item.dia)">
                  {{ item.Cantdia}}</v-chip>
              </template>
              <!-- <v-edit-dialog :return-value.sync="asignada.item.Requerimiento" large lazy
                  @save="updateRequerimiento(asignada.item.id)" cancel-text="Cancelar" save-text="Cambiar">
                  <div>{{ asignada.item.Requerimiento }} <v-icon color="warning" small>edit
                    </v-icon>
                  </div>
                  <template v-slot:input>
                    <v-autocomplete :items="allTiporequerimientos" item-text="Nombre" item-value="id"
                      label="Editar Requerimiento" v-model="newrequerimiento" :placeholder="asignada.item.Requerimiento">
                    </v-autocomplete>
                  </template>
                </v-edit-dialog>
              </template> -->
              <!-- <td>{{ asignada.item.Documento }}</td>
              <td>
                <v-chip v-show="asignada.item.Estado !== 'Cerrado temporal'" :class="ColorTd(asignada.item)">
                  {{ asignada.item.Cantdays}}</v-chip>
              </td>
              <td>
                <v-btn @click="VerObservaciones(asignada.item)" :disabled="loading" color="blue" flat icon>
                  <v-icon>library_books</v-icon>
                </v-btn>
              </td> -->
            </v-data-table>
  
            <!-- dialogo de historico -->
            <v-dialog v-model="dialog" v-if="dialog" persistent max-width="1000px">
              <v-card>
                <v-toolbar flat color="primary" dark>
                  <v-toolbar-title>Historial</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-col cols="12" sm="12" md="12">
                        <v-form>
                          <v-layout row wrap>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Ut" readonly label="ENTIDAD">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                              <v-text-field v-model="data.Tdocumento" readonly label="TIPO DOC"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Documento" readonly label="DOCUMENTO"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Nombre" readonly label="NOMBRE">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Apellido" readonly label="APELLIDO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Fecha_radica" readonly label="FECHA RADICACIÓN"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Radicado" readonly label="RADICADO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Direccion" readonly label="DIRECCIÓN"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Telefono" readonly label="TELEFONO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Municipio" readonly label="MUNICIPIO"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="data.Juzgado" readonly label="JUZGADO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.New_conti" readonly label="NUEVO/CONTINUIDAD"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Exclusion" readonly label="EXCLUSIÓN"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Integralidad" readonly label="INTEGRALIDAD"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="data.Requerimiento" readonly label="TIPO DE REQUERIMIENTO">
                              </v-text-field>
                            </v-col>
  
                            <!-- for si trae varios registros -->
                            <v-col cols="12" sm="12" md="12" v-if="data.roltutelas != ''">
                              <v-subheader>RESPONSABLE</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.roltutelas" :key="index">
                                  <v-chip label>
                                    {{data.NombreRol}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.tiposerviciotutelas.length > 0">
                              <v-subheader>TIPO DE SERVICIO</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.tiposerviciotutelas" :key="index">
                                  <v-chip label>
                                    {{data.Nombre}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.exclusiontutelas.length > 0">
                              <v-subheader>EXCLUSIONES</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.exclusiontutelas" :key="index">
                                  <v-chip label>
                                    {{data.Nombre}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.medicamentotutelas.length > 0">
                              <v-subheader>MEDICAMENTOS</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.medicamentotutelas" :key="index">
                                  <v-chip label>
                                    {{data.Medicamento}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.cuptutelas.length > 0">
                              <v-subheader>SERVICIOS</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.cuptutelas" :key="index">
                                  <v-chip label>
                                    {{data.Nombrecup}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Novedadregistro">
                              <v-text-field v-model="data.Novedadregistro" readonly label="NOVEDADES Y REGISTRO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Medicinalaboral">
                              <v-text-field v-model="data.Medicinalaboral" readonly label="MEDICINA LABORAL">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Reembolso">
                              <v-text-field v-model="data.Reembolso" readonly label="REEMBOLSO"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Transporte">
                              <v-text-field v-model="data.Transporte" readonly label="TRANSPORTE"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.gestiondocumental">
                              <v-text-field v-model="data.gestiondocumental" readonly label="GESTION DOCUMENTAL">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-textarea v-model="data.Observacion" readonly>
                                <template v-slot:label>
                                  <div>
                                    OBSERVACIÓN
                                  </div>
                                </template>
                              </v-textarea>
                              <span v-if="data.created_at"><strong>Fecha:
                                </strong>{{ data.created_at.split('.')[0] }} <strong>Nombre:
                                </strong>{{ data.NombreObservacion }}
                                {{ data.ApellidoObservacion }}</span>
                            </v-col>
  
                            <!-- adjuntos -->
                            <v-col cols="12" sm="12" md="12">
                              <v-btn v-for="(data, index) in data.adjuntos_tutelas" :key="index">
                                <a :href="`${data.Ruta}`" target="_blank" style="text-decoration:none">
                                  <v-icon color="dark">mdi-cloud-upload</v-icon>Adjunto
                                  {{index+1}}
                                </a>
                              </v-btn>
                              <v-divider class="my-4"></v-divider>
                            </v-col>
  
                            <!-- cargar respuestas -->
                            <v-col cols="12" sm="12" md="12" v-show="data.respuestatutelas.length > 0">
                              <v-layout wrap>
                                <v-col cols="12" sm="12" md="12" v-for="(ResTutela, index) in data.respuestatutelas"
                                  :key="index">
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field readonly :value="ResTutela.tipoactuacion" :label="'TIPO DE ACTUACIÓN'">
                                    </v-text-field>
                                    <v-textarea readonly :value="ResTutela.Respuesta" :label="`RESPUESTA ${index+1}`">
                                    </v-textarea>
                                    <span><strong>Fecha:
                                      </strong>{{ ResTutela.created_at.split('.')[0] }}
                                      <strong>Nombre: </strong>{{ ResTutela.Nombre }}
                                      {{ ResTutela.Apellido }}
                                      <strong v-if="ResTutela.Responsable">Responsable:
                                      </strong> {{ ResTutela.Responsable }}
                                    </span>
                                  </v-col>
                                  <v-flex>
                                    <v-btn v-for="(data, index) in ResTutela.adjuntos_respuestas" :key="index">
                                      <a :href="`${data.Ruta}`" target="_blank" style="text-decoration:none">
                                        <v-icon color="dark">mdi-cloud-upload
                                        </v-icon>Adjunto {{index+1}}
                                      </a>
                                    </v-btn>
                                  </v-flex>
                                  <v-divider class="my-4"></v-divider>
                                </v-col>
                              </v-layout>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-card v-if="data.Estado == 'Inadecuado'" class="mb-3">
                                <v-toolbar flat color="primary" dark>
                                  <v-toolbar-title>Inadecuado</v-toolbar-title>
                                </v-toolbar>
                                <v-container grid-list-md>
                                  <v-layout wrap>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-col cols="12" sm="12" md="12">
                                        <v-col cols="12" sm="12" md="12">
                                          <v-textarea readonly :value="data.Motivoreasignar" label="MOTIVO">
                                          </v-textarea>
                                          <span><strong>Fecha:
                                            </strong>{{ data.Fecharea }}
                                            <strong>Nombre:
                                            </strong>{{ data.NombreR }}
                                            {{ data.ApellidoR}}
                                          </span>
                                        </v-col>
                                      </v-col>
                                    </v-col>
                                  </v-layout>
                                </v-container>
                              </v-card>
                            </v-col>
  
                            <v-col cols="12" sm="12" md="6">
                              <v-autocomplete :items="roltutela" item-text="name" item-value="name" label="QUIEN RESPONDE"
                                v-model="responsablerespuesta"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-autocomplete v-model="tipoactuacion"
                                :items="['ACCION','RESPUESTA','FALLO PRIMERO', 'FALLO SEGUNDO', 'REQUERIMIENTO', 'DESACATO', 'SANCIÓN Y ARRESTO']"
                                label="TIPO DE ACTUACIÓN">
                              </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-textarea v-model="respuesta">
                                <template v-slot:label>
                                  <div>
                                    RESPUESTA
                                  </div>
                                </template>
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="5" v-if="data.roltutelas != ''">
                              <span class="red--text">
                                Importante:<br />
                                Pacial: todavia esta gestionando<br />
                                Final: gestionado
                              </span>
                              <p></p>
                              <v-combobox v-model="tiporespuesta" :items="['PARCIAL', 'FINAL']" chips
                                label="TIPO DE RESPUESTA">
                              </v-combobox>
                            </v-col>
                            <v-flex xs12>
                              <input id="adjuntos" multiple ref="adjuntos" type="file" />
                            </v-flex>
                          </v-layout>
                        </v-form>
                      </v-col>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-tooltip top
                    v-if="(data.Estado == 'Reasignada' | data.Estado == 'Pendiente' | data.Estado == 'Inadecuado')">
                    <template v-slot:activator="{ on }">
                      <v-btn fab outline color="error" small v-on="on" @click="desvincular()">
                        <v-icon>person_add_disabled</v-icon>
                      </v-btn>
                      <v-divider class="mx-3" vertical></v-divider>
                    </template>
                    <span>Desvincular</span>
                  </v-tooltip>
                  <v-btn dark color="teal" @click="alert()"
                    v-show="(data.Estado !== 'Parcial') && (data.Estado !== 'Cerrado temporal')">
                    Alerta
                  </v-btn>
                  <v-btn dark color="purple" v-show="(data.Estado !== 'Parcial') && (data.Estado !== 'Cerrado temporal')"
                    @click="OpenCompartir()">
                    Compartir
                  </v-btn>
                  <v-btn color="warning" @click="OpenReasignar()">Reasignar</v-btn>
                  <v-btn color="success" @click="cerrartutela = true">Cerrar
                    tutela</v-btn>
                  <v-btn color="primary" @click="AgregarRespuesta()">Responder</v-btn>
                  <v-btn color="error" @click="CloseObservaciones()">Salir</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
  
            <v-dialog v-model="compartir" persistent max-width="600px">
              <v-card>
                <v-toolbar flat color="primary" dark>
                  <v-toolbar-title>Compartir tutela</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-col cols="12" sm="12" md="12"
                        v-if=" (data.Estado !== 'Parcial') && (data.Estado !== 'Cerrado temporal') ">
                        <v-subheader>RESPONSABLE ACTUAL</v-subheader>
                        <v-item-group multiple>
                          <v-item v-for="(data, index) in data.roltutelas" :key="index">
                            <v-chip label>
                              {{data.NombreRol}}
                            </v-chip>
                          </v-item>
                        </v-item-group>
                        <v-divider class="my-2"></v-divider>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <span>Seleccione responsable con quien quiera compartir la tutela</span>
                        <v-autocomplete v-model="recompartir" :items="responsablestutela" item-text="fullname"
                          item-value="fullname" chips label="RESPONSABLE" multiple>
                          <template v-slot:selection="data">
                            <v-chip :selected="data.selected" close class="chip--select-multi"
                              @input="remove_responsablecompartir(data.item)">
                              {{ data.item.fullname }}
                            </v-chip>
                          </template>
                          <template v-slot:item="data">
                            <template v-if="typeof data.item.fullname !== 'object'">
                              <v-list-tile-content v-text="data.item.fullname">
                              </v-list-tile-content>
                            </template>
                            <template v-else>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="data.item"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="data.item">
                                </v-list-tile-sub-title>
                              </v-list-tile-content>
                            </template>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="CloseCompartir()">Cerrar</v-btn>
                  <v-btn color="blue darken-1" flat @click="compartirTutela()">Compartir</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
  
            <v-dialog v-model="reasignar" persistent max-width="600px">
              <v-card>
                <v-toolbar flat color="primary" dark>
                  <v-toolbar-title>Reasignar tutela</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-col cols="12" sm="12" md="12"
                        v-if="(data.Estado !== 'Parcial') && (data.Estado !== 'Cerrado temporal') ">
                        <v-subheader>RESPONSABLE ACTUAL</v-subheader>
                        <v-item-group multiple>
                          <v-item v-for="(data, index) in data.roltutelas" :key="index">
                            <v-chip label>
                              {{data.NombreRol}}
                            </v-chip>
                          </v-item>
                        </v-item-group>
                        <v-divider class="my-2"></v-divider>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <span>Seleccione responsable a quien quiera reasignar la tutela</span>
                        <v-autocomplete v-model="Rearesponsable" :items="responsablestutela" item-text="fullname"
                          item-value="fullname" chips label="RESPONSABLE" multiple>
                          <template v-slot:selection="data">
                            <v-chip :selected="data.selected" close class="chip--select-multi"
                              @input="remove_responsable(data.item)">
                              {{ data.item.fullname }}
                            </v-chip>
                          </template>
                          <template v-slot:item="data">
                            <template v-if="typeof data.item.fullname !== 'object'">
                              <v-list-tile-content v-text="data.item.fullname">
                              </v-list-tile-content>
                            </template>
                            <template v-else>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="data.item"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="data.item">
                                </v-list-tile-sub-title>
                              </v-list-tile-content>
                            </template>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col>
                        <v-textarea v-model="motivoreasignar">
                          <template v-slot:label>
                            <div>
                              MOTIVO
                            </div>
                          </template>
                        </v-textarea>
                      </v-col>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="CloseReasignar()">Cerrar</v-btn>
                  <v-btn color="blue darken-1" flat @click="ReasignarTutela()">Reasignar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
  
            <v-dialog v-model="cerrartutela" persistent max-width="600px">
              <v-card>
                <v-toolbar flat color="primary" dark>
                  <v-toolbar-title>Cerrar tutela</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-col cols="12" sm="12" md="6">
                        <v-combobox chips v-model="tipocierre" :items="['Cerrado Temporal', 'Cerrado']"
                          label="TIPO DE CERRADO">
                        </v-combobox>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea v-model="motivoclosetutela">
                          <template v-slot:label>
                            <div>
                              MOTIVO
                            </div>
                          </template>
                        </v-textarea>
                      </v-col>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="SalircloseTutela()">Salir</v-btn>
                  <v-btn color="success" @click="CloseTutela()">Cerrar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-card>
  
      </v-tab-item>
  
      <!-- cerrados -->
      <v-tab-item :value="'tab-2'">
        <v-card flat>
  
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar...." single-line hide-details>
              </v-text-field>
            </v-card-title>
  
            <v-dialog v-model="historial" persistent max-width="1000px">
              <v-card>
                <v-toolbar flat color="primary" dark>
                  <v-toolbar-title>Historial</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-col cols="12" sm="12" md="12">
                        <v-form>
                          <v-layout row wrap>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Ut" readonly label="ENTIDAD">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                              <v-text-field v-model="data.Tdocumento" readonly label="TIPO DOC"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Documento" readonly label="DOCUMENTO"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Nombre" readonly label="NOMBRE">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Apellido" readonly label="APELLIDO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Fecha_radica" readonly label="FECHA RADICACIÓN"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-text-field v-model="data.Radicado" readonly label="RADICADO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Direccion" readonly label="DIRECCIÓN"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Telefono" readonly label="TELEFONO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Municipio" readonly label="MUNICIPIO"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="data.Juzgado" readonly label="JUZGADO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.New_conti" readonly label="NUEVO/CONTINUIDAD"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Exclusion" readonly label="EXCLUSIÓN"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                              <v-text-field v-model="data.Integralidad" readonly label="INTEGRALIDAD"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="data.Requerimiento" readonly label="TIPO DE REQUERIMIENTO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-subheader>RESPONSABLE</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.roltutelas" :key="index">
                                  <v-chip label>
                                    {{data.NombreRol}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.tiposerviciotutelas.length > 0">
                              <v-subheader>TIPO DE SERVICIO</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.tiposerviciotutelas" :key="index">
                                  <v-chip label>
                                    {{data.Nombre}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.exclusiontutelas.length > 0">
                              <v-subheader>EXCLUSIONES</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.exclusiontutelas" :key="index">
                                  <v-chip label>
                                    {{data.Nombre}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.medicamentotutelas.length > 0">
                              <v-subheader>MEDICAMENTOS</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.medicamentotutelas" :key="index">
                                  <v-chip label>
                                    {{data.Medicamento}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.cuptutelas.length > 0">
                              <v-subheader>SERVICIOS</v-subheader>
                              <v-item-group multiple>
                                <v-item v-for="(data, index) in data.cuptutelas" :key="index">
                                  <v-chip label>
                                    {{data.Nombrecup}}
                                  </v-chip>
                                </v-item>
                              </v-item-group>
                              <v-divider class="my-2"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Novedadregistro">
                              <v-text-field v-model="data.Novedadregistro" readonly label="NOVEDADES Y REGISTRO">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Medicinalaboral">
                              <v-text-field v-model="data.Medicinalaboral" readonly label="MEDICINA LABORAL">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Reembolso">
                              <v-text-field v-model="data.Reembolso" readonly label="REEMBOLSO"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" v-show="data.Transporte">
                              <v-text-field v-model="data.Transporte" readonly label="TRANSPORTE"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.gestiondocumental">
                              <v-text-field v-model="data.gestiondocumental" readonly label="GESTION DOCUMENTAL">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-textarea v-model="data.Observacion" readonly>
                                <template v-slot:label>
                                  <div>
                                    OBSERVACIÓN
                                  </div>
                                </template>
                              </v-textarea>
                              <span v-if="data.created_at">
                                <strong>Fecha:</strong> {{ data.created_at.split('.')[0] }}
                                <strong>Nombre:</strong> {{ data.NombreObservacion }}
                                {{ data.ApellidoObservacion }}</span>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-btn v-for="(data, index) in data.adjuntos_tutelas" :key="index">
                                <a :href="`${data.Ruta}`" target="_blank" style="text-decoration:none">
                                  <v-icon color="dark">mdi-cloud-upload</v-icon>Adjunto
                                  {{index+1}}
                                </a>
                              </v-btn>
                              <v-divider class="my-4"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="data.respuestatutelas.length > 0">
                              <v-layout wrap>
                                <v-col cols="12" sm="12" md="12" v-for="(ResTutela, index) in data.respuestatutelas"
                                  :key="index">
                                  <v-col cols="12" sm="12" md="12">
                                    <v-textarea readonly :value="ResTutela.Respuesta" :label="`RESPUESTA ${index+1}`">
                                    </v-textarea>
                                    <span><strong>Fecha:
                                      </strong>{{ ResTutela.created_at.split('.')[0] }}
                                      <strong>Nombre: </strong>{{ ResTutela.Nombre }}
                                      {{ ResTutela.Apellido }}
                                      <strong v-if="ResTutela.Responsable">Responsable:
                                      </strong> {{ ResTutela.Responsable }}
                                    </span>
                                  </v-col>
                                  <v-flex>
                                    <v-btn v-for="(data, index) in ResTutela.adjuntos_respuestas" :key="index">
                                      <a :href="`${data.Ruta}`" target="_blank" style="text-decoration:none">
                                        <v-icon color="dark">mdi-cloud-upload
                                        </v-icon>Adjunto {{index+1}}
                                      </a>
                                    </v-btn>
                                  </v-flex>
                                  <v-divider class="my-4"></v-divider>
                                </v-col>
                              </v-layout>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-textarea v-model="data.Motivo_cerrar" readonly>
                                <template v-slot:label>
                                  <div>
                                    MOTIVO DE CIERRE
                                  </div>
                                </template>
                              </v-textarea>
                              <span>
                                <strong>Fecha: </strong> {{ data.Fecha_cerrada }}
                                <strong>Nombre: </strong> {{ data.NombreCerro }}
                                {{ data.ApellidoCerro }}
                              </span>
                            </v-col>
                          </v-layout>
                        </v-form>
                      </v-col>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="CerrarVhistorial()">Cerrar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
  
            <v-dialog v-model="dialogAlert" persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Estamos procesando su solicitud
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
  
            <v-data-table :headers="headers2" :items="cerradas" :search="search">
              <template v-slot:items="asignada">
                <td>{{ asignada.item.id }}</td>
                <td>{{ asignada.item.Nombre }} {{ asignada.item.Apellido }}</td>
                <td>{{ asignada.item.Tdocumento }}</td>
                <td>{{ asignada.item.Documento }}</td>
                <td>{{ asignada.item.Requerimiento }}</td>
                <td>
                  <v-menu open-on-hover right offset-y>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">message</v-icon>
                    </template>
  
                    <v-list>
                      <v-list-tile v-for="(data, index) in asignada.item.roltutelas" :key="index">
                        {{ data.NombreRol }}
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </td>
                <td>
                  <v-btn @click="VerHistorial(asignada.item)" color="blue" flat icon>
                    <v-icon>remove_red_eye</v-icon>
                  </v-btn>
                </td>
              </template>
              <template v-slot:no-results>
                <v-alert :value="true" color="error" icon="warning">
                  Su búsqueda de "{{ search }}" no encontró resultados.
                </v-alert>
              </template>
            </v-data-table>
          </v-card>
  
        </v-card>
      </v-tab-item>
    </v-tabs>
  
  </template>
  <script>
    import moment from 'moment';
    import {
      listarAfiliados,
      actualizarAfiliado,
      buscarAfiliado,
    } from '@/api/afiliados/afiliados'
    import {
      listarTiposRequerimientos,
    } from '@/api/tutelas/tipoRequerimientotutelas'
    import {
      listarResponsable,
    } from '@/api/tutelas/responsableTutelas'
    import {
      listarRoles
    } from '@/api/admin/roles/roles'
    import {
      listarTutela
    } from '@/api/tutelas/tutela'
    export default {
      data() {
        return {
          paginate: {
            total: 0,
            page: 1
          },
          tutelas: [],
          responsablerespuesta: null,
          tipoactuacion: null,
          tiporespuesta: 'PARCIAL',
          search: null,
          headerMiGestion: [{
              text: 'Radicado',
              align: 'left',
              value: 'id'
            },
            {
              text: 'Cédula',
              align: 'left',
              value: 'afiliados.ut'
            },
            {
              text: 'Cédula SuperSalud',
              align: 'left',
              value: 'created_at'
            },
            {
              text: 'Tipo Solicitud',
              value: 'municipios.nombre',
              align: 'left'
            },
            {
              text: 'Asignado a',
              value: 'respuesta',
              align: 'left'
            },
            {
              text: 'Semáforo',
              align: 'left',
              value: 'tipo_requerimientos.nombre'
            },
            {
              text: 'Fecha Generada',
              align: 'left',
              value: 'afiliados.numero_documento'
            },
            {
              text: 'Canal',
              align: 'left',
              value: 'Cantdays'
            },
            {
              text: 'Acciones',
              value: 'actions',
              align: 'left'
            }
          ],
          headers2: [{
              text: 'id',
              align: 'left',
              value: 'id'
            },
            {
              text: 'Nombre',
              align: 'left',
              value: 'Nombre'
            },
            {
              text: 'Tipo de documento',
              align: 'left',
              value: 'Tdocumento'
            },
            {
              text: 'Documento',
              align: 'left',
              value: 'Documento'
            },
            {
              text: 'Tipo de requerimiento',
              align: 'left',
              value: 'Requerimiento'
            },
            {
              text: 'Responsable',
              align: 'left'
            },
  
            {
              text: 'Historial',
              align: 'left'
            }
          ],
          asignadas: [],
          asignada: [],
          cerradas: [],
          Documento: [],
          compartir: false,
          dialog: false,
          historial: false,
          reasignar: false,
          cerrartutela: false,
          showrespuestas: true,
          data: {
            Tdocumento: "",
            Documento: "",
            Nombre: "",
            Apellido: "",
            Telefono: "",
            Direccion: "",
            Municipio: "",
            Radicado: "",
            Juzgado: "",
            Exclusion: "",
            Integralidad: "",
            Tipo_requerimiento: "",
            Tipo_servicio: [],
            Observacion: "",
            exclusiontutelas: [],
            tiposerviciotutelas: [],
            medicamentotutelas: [],
            cuptutelas: [],
            adjuntos: [],
            respuestatutelas: [],
            roltutelas: []
          },
          dataC: {
            Tdocumento: "",
            Documento: "",
            Nombre: "",
            Apellido: "",
            Telefono: "",
            Direccion: "",
            Municipio: "",
            Radicado: "",
            Juzgado: "",
            Exclusion: "",
            Integralidad: "",
            Tipo_requerimiento: "",
            Tipo_servicio: "",
            Observacion: ""
          },
          respuesta: "",
          Rearesponsable: [],
          motivoreasignar: "",
          motivoclosetutela: "",
          recompartir: [],
          responsablestutela: [],
          estado: "Pendiente",
          loading: false,
          roles: [],
          tipocierre: "Cerrado Temporal",
          dialogAlert: false,
          allTiporequerimientos: [],
          newrequerimiento: '',
          diasTotal: '',
        }
      },
      created() {
        // this.getAsignadas();
        // this.getCerradas();
        // this.getResponsables();
        // this.getRoles();
        // this.getTiporequerimiento();
        this.listarTutelas()
      },
      computed: {
        Filterdays() {
          return this.tutelas.map(asignada => {
            let dia = this.DiasRestantes(asignada)
            let Cantdia = ''
            if (dia < 0) {
              Cantdia = 'INMEDIATO'
            } else {
              Cantdia = (dia) ? `${dia} DÍA(S)` : 'INMEDIATO'
            }
            return {
              ...asignada,
              dia,
              Cantdia
            }
          })
        },
        // roltutela() {
        //   let rolesUser = this.roles
        //   let rolesTutela = this.data.roltutelas
        //   let findRoles = []
        //   const ADMIN = [
        //     'Juridica',
        //     'Tutelas Gestion de Solicitudes',
        //     'Dirección Medica'
        //   ]
        //   rolesTutela.forEach(tutela => {
        //     let finded = rolesUser.find(user => user.name == tutela.NombreRol)
        //     if (finded) findRoles.push(finded)
        //   });
        //   ADMIN.forEach(admin => {
        //     let finded = rolesUser.find(user => user.name == admin)
        //     if (finded) {
        //       let findedRole = findRoles.find(role => role && role.name == finded.name)
        //       if (!findedRole) findRoles.push({
        //         name: admin
        //       })
        //     }
        //   })
        //   if (findRoles.length == 1) this.responsablerespuesta = findRoles[0].name;
        //   return findRoles
        // }
      },
      methods: {
  
        async listarTutelas() {
          try {
            const {
              data
            } = await this.$loadingGetRequest(listarTutela())
            this.tutelas = data.data
          } catch (error) {
            console.log(error)
          };
        },
  
        // async getTiporequerimiento() {
        //   try {
        //     const {
        //       data
        //     } = await this.$loadingGetRequest(listarTiposRequerimientos())
        //     this.allTiporequerimientos = data.data;
        //   } catch (error) {
        //     console.log(error)
        //   }
        // },
  
        // async getResponsables() {
        //   try {
        //     const {
        //       data
        //     } = await this.$loadingGetRequest(listarResponsable())
        //     this.responsablestutela = data.data.map(responsable => {
        //       return {
        //         id: responsable.id,
        //         fullname: responsable.NombreRol
        //       };
        //     });
        //   } catch (error) {
        //     console.log(error)
        //   }
        // },
  
        // async getRoles() {
        //   try {
        //     const {
        //       data
        //     } = await this.$loadingGetRequest(listarRoles(0, 0))
        //     this.roles = data.data
        //   } catch (error) {
        //     console.log(error)
        //   }
  
        // },
        // remove_responsable(item) {
        //   this.Rearesponsable.splice(this.Rearesponsable.indexOf(item), 1)
        //   this.Rearesponsable = [...this.Rearesponsable]
        // },
        // remove_responsablecompartir(item) {
        //   this.recompartir.splice(this.recompartir.indexOf(item), 1)
        //   this.recompartir = [...this.recompartir]
        // },
  
        // async getAsignadas() {
        //   try {
        //     this.loading = true;
        //     let formData = new FormData();
        //     formData.append("estado", this.estado);
        //     const {
        //       data
        //     } = await this.$loadingPostRequest(listarAfiliados(this.paginate.page), this.estado)
        //     this.loading = false
        //     this.asignadas = data.data;
        //   } catch (error) {
        //     this.loading = false
        //     console.log(error)
        //   }
        // },
        // async getCerradas() {
        //   try {
        //     const {
        //       data
        //     } = await this.$loadingGetRequest(listarAfiliados())
        //     this.cerradas = data.data;
        //   } catch (error) {
        //     console.log(error)
        //   }
        // },
  
        DiasRestantes(asignadas) {
  
          let dias = asignadas.tipo_requerimientos.dias
          let fechaAsignado = moment(asignadas.created_at);
          let fechaActual = moment();
          let diferenciadays = fechaActual.diff(fechaAsignado, 'days');
          let Total = dias - diferenciadays;
          return Total;
  
        },
  
        ColorTd(asignada) {
          if (asignada == 1) {
            return 'yellow black--text';
          } if (asignada >= 2) {
            return 'success white--text';
          } else {
            return 'error white--text';
          }
        },
  
        // VerObservaciones(asignadas) {
        //   this.showrespuestas = false;
        //   this.data = asignadas;
        //   this.dialog = true;
        // },
        // CloseObservaciones() {
        //   this.tiporespuesta = "PARCIAL"
        //   this.responsablerespuesta = ""
        //   this.showrespuestas = true
        //   this.respuesta = ""
        //   this.$refs.adjuntos.value = ""
        //   this.tipoactuacion = ""
        //   this.dialog = false;
        // },
        // VerHistorial(asignadas) {
        //   this.data = asignadas;
        //   this.historial = true;
        // },
        // CerrarVhistorial() {
        //   this.historial = false;
        // },
  
        // async AgregarRespuesta() {
        //   if (this.responsablerespuesta == "") {
        //     this.$swal({
        //       title: "¡Debe seleccionar quien responde!",
        //       text: ` `,
        //       timer: 2000,
        //       type: "error",
        //       buttons: false
        //     })
        //     return
        //   }
        //   this.showrespuestas = true
        //   this.data.adjuntos = this.$refs.adjuntos.files;
        //   let formData = new FormData();
        //   formData.append('tutelaid', this.data.id)
        //   formData.append('respuesta', this.respuesta)
        //   formData.append('responsablerespuesta', this.responsablerespuesta)
        //   formData.append('tiporespuesta', this.tiporespuesta)
        //   formData.append('tipoactuacion', this.tipoactuacion)
        //   for (let i = 0; i < this.data.adjuntos.length; i++) {
        //     formData.append(`adjuntos[]`, this.data.adjuntos[i]);
        //   }
        //   if (this.responsablerespuesta == "Coordinacion Farmacia") {
        //     if (this.$refs.adjuntos.value == "" && this.tiporespuesta == "FINAL") {
        //       this.$swal({
        //         title: "¡Debe adjuntar un archivo!",
        //         text: ` `,
        //         timer: 2000,
        //         type: "error",
        //         buttons: false
        //       })
        //       return
        //     }
        //   }
        //   const {
        //     data
        //   } = await loadingPostRequest(listarAfiliados(), formData)
        //   try {
        //     this.getAsignadas();
        //     this.getCerradas();
        //     this.$swal({
        //       title: "¡Respuesta guardada con exito!",
        //       text: ` `,
        //       timer: 2000,
        //       type: "success",
        //       buttons: false
        //     });
        //     this.CloseObservaciones();
        //   } catch (error) {
        //     this.$swal({
        //       title: "¡Debe ingresar todos los campos para respuesta!",
        //       text: ` `,
        //       timer: 2000,
        //       type: "error",
        //       buttons: false
        //     })
        //   }
        // },
  
        // CloseTutela() {
        //   let formData = new FormData();
        //   formData.append('tutelaid', this.data.id)
        //   formData.append('tipocierre', this.tipocierre)
        //   formData.append('motivoclosetutela', this.motivoclosetutela)
        //   this.$swal({
        //     title: 'Esta seguro de cerrar la tutela?',
        //     type: "info",
        //     buttons: ["Cancelar", "Confirmar"],
        //     dangerMode: true
        //   }).then(async resultado => {
        //     if (resultado) {
        //       const {
        //         datos
        //       } = await loadingPostRequest(`/api/tutelas/cerrartutela`, formData)
        //       try {
        //         this.getAsignadas();
        //         this.getCerradas();
        //         this.$swal({
        //           title: "¡Tutela cerrada con exito!",
        //           text: ` `,
        //           timer: 2000,
        //           icon: "success",
        //           buttons: false
        //         });
        //         this.SalircloseTutela();
        //         this.CloseObservaciones();
        //       } catch (error) {
        //         this.$swal({
        //           title: "¡Debe ingresar un motivo!",
        //           text: ` `,
        //           timer: 2000,
        //           icon: "error",
        //           buttons: false
        //         })
        //       }
        //     }
        //   });
        // },
  
        // OpenReasignar() {
        //   this.reasignar = true
        // },
  
        // CloseReasignar() {
        //   this.Rearesponsable = []
        //   this.motivoreasignar = ""
        //   this.reasignar = false
        // },
  
        // ReasignarTutela() {
        //   let formData = new FormData();
        //   formData.append('tutelaid', this.data.id)
        //   formData.append('Num_Doc', this.data.Documento)
        //   formData.append('estado', this.data.Estado)
        //   for (let i = 0; i < this.Rearesponsable.length; i++) {
        //     formData.append(`responsable[]`, this.Rearesponsable[i]);
        //   }
        //   formData.append('motivo', this.motivoreasignar)
        //   const msg = "Esta seguro de reasignar la tutela?";
        //   this.$swal({
        //     title: msg,
        //     type: "info",
        //     buttons: ["Cancelar", "Confirmar"],
        //     dangerMode: true
        //   }).then(async respuesta => {
        //     if (respuesta) {
        //       this.dialogAlert = true
        //       const {
        //         data
        //       } = await loadingPostRequest(`/api/tutelas/reasignar`, formData, {})
        //       try {
        //         this.dialogAlert = false
        //         this.getAsignadas();
        //         this.showrespuestas = true
        //         this.getCerradas();
        //         this.$swal({
        //           title: "¡Tutela reasignada con exito!",
        //           text: ` `,
        //           timer: 2000,
        //           type: "success",
        //           buttons: false
        //         });
        //         this.CloseReasignar();
        //         this.CloseObservaciones();
        //       } catch (error) {
        //         this.dialogAlert = false
        //         this.$swal({
        //           title: "¡Debe ingresar los campos obligatorios!",
        //           text: ` `,
        //           timer: 2000,
        //           type: "error",
        //           buttons: false
        //         })
        //       }
        //     }
        //   });
        // },
        // SalircloseTutela() {
        //   this.motivoclosetutela = ""
        //   this.cerrartutela = false
        // },
        // OpenCompartir() {
        //   this.compartir = true
        // },
        // CloseCompartir() {
        //   this.recompartir = []
        //   this.compartir = false
        // },
        // compartirTutela() {
        //   let encuentra = false;
        //   for (let i = 0; i < this.recompartir.length; i++) {
        //     let compartir = this.recompartir[i]
        //     for (let j = 0; j < this.data.roltutelas.length; j++) {
        //       let responsable = this.data.roltutelas[j].NombreRol
        //       if (compartir == responsable) {
        //         encuentra = true;
        //         break;
        //       }
        //     }
        //     if (encuentra == true) {
        //       this.$swal({
        //         title: "¡La Tutela ya esta compartida con ese responsable!",
        //         text: ` `,
        //         timer: 2000,
        //         type: "error",
        //         buttons: false
        //       });
        //       break;
        //     }
        //   }
        //   if (encuentra == false) {
        //     let formData = new FormData();
        //     formData.append('tutelaid', this.data.id)
        //     formData.append('Num_Doc', this.data.Documento)
        //     for (let i = 0; i < this.recompartir.length; i++) {
        //       formData.append(`responsable[]`, this.recompartir[i]);
        //     }
        //     const msg = "Esta seguro de compartir la tutela?";
        //     this.$swal({
        //       title: msg,
        //       type: "info",
        //       buttons: ["Cancelar", "Confirmar"],
        //       dangerMode: true
        //     }).then(async resultado => {
        //       if (resultado) {
        //         const {
        //           data
        //         } = await loadingPostRequest(`/api/tutelas/compartir`, formData, {})
        //         try {
        //           this.getAsignadas();
        //           this.showrespuestas = true
        //           this.getCerradas();
        //           this.$swal({
        //             title: "¡Tutela compartida con exito!",
        //             text: ` `,
        //             timer: 2000,
        //             type: "success",
        //             buttons: false
        //           });
        //           this.CloseCompartir();
        //           this.CloseObservaciones();
        //         } catch (error) {
        //           this.$swal({
        //             title: "¡Debe ingresar los campos obligatorios!",
        //             text: ` `,
        //             timer: 2000,
        //             type: "error",
        //             buttons: false
        //           })
        //         }
        //       }
        //     });
        //   }
        // },
  
        // alert() {
        //   this.responsable = this.data.roltutelas
        //   let formData = new FormData();
        //   formData.append('documento', this.data.Documento)
        //   formData.append('tutelaid', this.data.id)
        //   for (let i = 0; i < this.responsable.length; i++) {
        //     formData.append(`responsable[]`, this.responsable[i].NombreRol);
        //   }
        //   swal({
        //     title: "¿Está Seguro(a) de enviar la alerta?",
        //     text: "",
        //     icon: "warning",
        //     buttons: ["Cancelar", "Confirmar"],
        //     dangerMode: true,
        //   }).then(async (respuesta) => {
        //     if (respuesta) {
        //       this.dialogAlert = true
        //       const {
        //         data
        //       } = await loadingPostRequest('/api/tutelas/alert', formData)
        //       try {
        //         this.dialogAlert = false
        //         this.$alerSuccess('Alerta enviada con Exito!');
        //       } catch (error) {
        //         console.log(error)
        //       }
        //     }
        //   })
        // },
  
        // desvincular() {
        //   this.$swal({
        //     title: "¿Está seguro(a) de desvincular?",
        //     text: "",
        //     type: "warning",
        //     buttons: ["Cancelar", "Confirmar"],
        //     dangerMode: true,
        //   }).then(async (resultado) => {
        //     if (resultado) {
        //       this.dialogAlert = true
        //       const {
        //         data
        //       } = await loadingPostRequest('/api/tutelas/desvincular', {
        //         tutelaid: this.data.id
        //       })
        //       try {
        //         this.dialogAlert = false
        //         this.CloseObservaciones();
        //         this.getAsignadas();
        //         this.getCerradas();
        //         this.$alerSuccess('Tutela desvinculada con exito!');
        //       } catch (error) {
        //         this.dialogAlert = false
        //       }
        //     }
        //   })
        // },
  
        // async updateRequerimiento(item) {
        //   let datos = {
        //     tutela_id: item,
        //     requerimiento_id: this.newrequerimiento
        //   }
        //   const {
        //     data
        //   } = await loadingPutRequest('/api/tutelas/updateRequerimiento', datos)
        //   try {
        //     this.newrequerimiento = ''
        //     this.getAsignadas();
        //     this.getCerradas();
        //     this.$alerSuccess('Requerimiento actualizado con exito!');
        //   } catch (error) {
        //     console.log(error)
        //   }
        // }
      }
    }
  
  </script>
  