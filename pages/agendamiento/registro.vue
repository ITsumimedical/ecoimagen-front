<template>
    <div>
        <v-card>
            <v-card outlined>
                <v-card-title>
                    <v-toolbar flat dense>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="icono" height="40px" width="40px" />
                                <span class="ml-2 text-subtitle-1 font-weight-bold">
                                    Registro de agendas por médico
                                </span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                    </v-toolbar>
                </v-card-title>

                <v-card-text>
                    <div class="d-flex align-start">
                        <div style="flex: 0 0 40%; max-width: 400px;" class="pr-4">
                            <v-autocomplete v-model="medico" outlined dense @change="getAgenda()"
                                no-data-text="Digite el nombre del médico para iniciar la búsqueda (mínimo 6 letras)"
                                :items="medicosActivos" item-text="nombre_completo" item-value="user_id" label="Médico"
                                :loading="loading" :disabled="loading"
                                placeholder="Selecciona al médico para ver su agenda"
                                hint="Médico seleccionado para consulta de agenda" v-if="$can('agendamiento.buscar')" />
                        </div>

                        <div style="flex: 1;" v-if="medico">
                            <v-card outlined class="pa-2" height="100%">
                                <v-card-title class="pa-2 text-subtitle-2 font-weight-bold">
                                    Indicadores de estados
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="d-flex flex-wrap justify-start pa-2">
                                    <v-chip v-for="(estado, index) in estados" :key="index" :color="estado.color"
                                        text-color="white" small class="ma-1" label>
                                        <v-icon left small>{{ estado.icon }}</v-icon>
                                        {{ estado.label }}
                                    </v-chip>
                                </v-card-text>
                            </v-card>
                        </div>
                    </div>
                </v-card-text>
            </v-card>

            <v-sheet height="64" class="elevation-1" v-if="medico">
                <v-toolbar flat dense>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn outlined color="primary" class="mr-2 rounded-lg" v-bind="attrs" v-on="on"
                                @click="setToday">
                                <v-icon left small>mdi-calendar-today</v-icon>
                                Hoy
                            </v-btn>
                        </template>
                        <span>Ir a la fecha actual</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small v-bind="attrs" v-on="on" icon outlined color="primary"
                                class="mr-2 calendar-nav-btn" @click="prev">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                        </template>
                        <span>Ver periodo anterior</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small v-bind="attrs" v-on="on" icon outlined color="primary"
                                class="mr-4 calendar-nav-btn" @click="next">
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </template>
                        <span>Ver periodo siguiente</span>
                    </v-tooltip>

                    <v-toolbar-title class="font-weight-bold text-primary">
                        {{ $refs.calendar ? $refs.calendar.title : '' }}
                    </v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-menu bottom right transition="scale-transition">
                                <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                                    <v-btn outlined color="indigo darken-2" class="rounded-lg"
                                        v-bind="{ ...attrs, ...menuAttrs }" v-on="{ ...on, ...menuOn }">
                                        <v-icon left small>mdi-eye-outline</v-icon>
                                        <span>{{ typeToLabel[type] }}</span>
                                        <v-icon right small>mdi-menu-down</v-icon>
                                    </v-btn>
                                </template>

                                <v-list>
                                    <v-list-item @click="type = 'day'">
                                        <v-list-item-icon>
                                            <v-icon color="blue">mdi-calendar-cursor</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>Día</v-list-item-title>
                                    </v-list-item>

                                    <v-list-item @click="type = 'week'">
                                        <v-list-item-icon>
                                            <v-icon color="green">mdi-calendar-week</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>Semana</v-list-item-title>
                                    </v-list-item>

                                    <v-list-item @click="type = 'month'">
                                        <v-list-item-icon>
                                            <v-icon color="deep-purple">mdi-calendar-month</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>Mes</v-list-item-title>
                                    </v-list-item>

                                    <v-list-item @click="type = '4day'">
                                        <v-list-item-icon>
                                            <v-icon color="orange">mdi-calendar-range</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>4 días</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                        <span>Cambiar vista del calendario</span>
                    </v-tooltip>

                </v-toolbar>
            </v-sheet>

            <!-- calendario -->
            <v-sheet height="600" v-if="medico">
                <v-calendar ref="calendar" v-model="focus" :start="fechaActual" :events="events"
                    :event-color="getEventColor" :type="type" :weekday-format="getDay" :short-weekdays="true"
                    :short-intervals="true" show-current event-more-text="⤵️ Ver día completo" locale="es-co" lang="ES"
                    color="primary" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" />
            </v-sheet>

            <!-- detalle del evento -->
            <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x
                max-width="1100px">
                <v-card max-width="1100px">
                    <v-alert dense prominent :color="selectedEvent.color" dark class="mb-3">
                        <div class="d-flex align-center justify-space-between w-100">
                            <div class="d-flex align-center">
                                <v-icon left small>mdi-calendar-edit</v-icon>
                                <span class="font-weight-medium" v-html="selectedEvent.name"></span>

                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn small icon color="white" class="ml-2" v-bind="attrs" v-on="on"
                                            @click="actualizarCita()">
                                            <v-icon small>mdi-refresh</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Actualizar tipo de cita</span>
                                </v-tooltip>
                            </div>

                            <v-chip small color="white" text-color="black" label>
                                {{ agenda?.cita.tipo_cita.nombre }}
                            </v-chip>
                        </div>
                    </v-alert>

                    <v-row no-gutters>
                        <v-col cols="12" sm="6" md="6">
                            <v-list-item dense>
                                <v-list-item-content>
                                    <v-list-item-icon>
                                        <v-icon color="blue darken-4"> mdi-stethoscope </v-icon>
                                        <v-list-item-title>Especialidad</v-list-item-title>
                                    </v-list-item-icon>
                                    <v-divider></v-divider>
                                    <v-list-item-subtitle><span
                                            v-html="agenda?.cita.especialidad.nombre"></span></v-list-item-subtitle>
                                    <v-row dense>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-list-item-icon>
                                                <v-icon color="blue darken-4">
                                                    mdi-timer-sand-complete
                                                </v-icon>
                                                <v-list-item-title>Duración máxima</v-list-item-title>
                                            </v-list-item-icon>
                                            <v-divider></v-divider>
                                            <v-list-item-subtitle><span v-html="agenda?.cita.tiempo_consulta"></span>
                                                Minutos
                                            </v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-list-item-icon>
                                                <v-icon color="blue darken-4">
                                                    mdi-account-group-outline
                                                </v-icon>
                                                <v-list-item-title>Capacidad</v-list-item-title>
                                            </v-list-item-icon>
                                            <v-divider></v-divider>
                                            <v-list-item-subtitle><span
                                                    v-html="agenda?.consultorio.cantidad_paciente"></span>
                                            </v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-list-item-icon>
                                                <v-icon color="blue darken-4">
                                                    mdi-door-sliding
                                                </v-icon>
                                                <v-list-item-title>Consultorio</v-list-item-title>
                                            </v-list-item-icon>
                                            <v-divider></v-divider>
                                            <v-list-item-subtitle><span
                                                    v-html="agenda?.consultorio.nombre"></span></v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-list-item-icon>
                                                <v-icon color="blue darken-4">
                                                    mdi-calendar-clock-outline
                                                </v-icon>
                                                <v-list-item-title>Fecha y hora inicio</v-list-item-title>
                                            </v-list-item-icon>
                                            <v-divider></v-divider>
                                            <v-list-item-subtitle><span v-html="agenda?.fecha_inicio"></span>
                                            </v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-list-item-icon>
                                                <v-icon color="blue darken-4">
                                                    mdi-store-marker
                                                </v-icon>
                                                <v-list-item-title>Prestador</v-list-item-title>
                                            </v-list-item-icon>
                                            <v-divider></v-divider>
                                            <v-list-item-subtitle><span v-html="agenda?.consultorio.rep.nombre"></span>
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle><span
                                                    v-html="agenda?.consultorio.rep.direccion"></span>
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle><span
                                                    v-html="agenda?.consultorio.rep.municipio.nombre"></span>
                                            </v-list-item-subtitle>
                                        </v-col>
                                    </v-row>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                        <v-col cols="6" md="6">
                            <v-list-item dense>
                                <v-list-item-content>
                                    <v-list-item-icon>
                                        <v-icon color="blue darken-4"> mdi-account-outline </v-icon>
                                        <v-list-item-title>Paciente(s)</v-list-item-title>
                                    </v-list-item-icon>
                                    <v-divider></v-divider>
                                    <v-list-item-subtitle v-for="(item, i) in consultasFiltradas" :key="i">
                                        <p>
                                            <b style="color: #0d47a1">{{
                                                item.afiliado.nombre_completo
                                                }}</b>
                                            |
                                            <b style="color: black">{{
                                                item.afiliado.numero_documento
                                                }}</b>
                                            |
                                            <span v-if="item.estado_id === 14">
                                                <v-chip small dark color="orange" label>Cita confirmada</v-chip>
                                            </span>
                                            <span v-if="item.estado_id === 67">
                                                <v-chip small dark color="purple darken-3" label>Cita por confirmar via
                                                    Whatsapp</v-chip>
                                            </span>
                                            <span v-if="item.estado_id === 13">
                                                <v-chip small dark color="orange" label>Cita Sin Confirmar</v-chip>
                                            </span>
                                            <span v-if="item.estado_id === 30">
                                                <v-chip small dark color="red" label>Cita cancelada</v-chip>
                                            </span>
                                            <span v-if="item.estado_id === 5">
                                                <v-chip small dark color="red" label>Cita anulada</v-chip>
                                            </span>
                                            <span v-if="item.estado_id === 8">
                                                <v-chip small dark color="red" label>Cita inasistida</v-chip>
                                            </span>
                                            <span v-if="item.estado_id === 9">
                                                <v-chip small dark color="light-blue accent-3" label>Cita
                                                    atendida</v-chip>
                                            </span>
                                        </p>
                                        <p>
                                            <b style="color: black">Observación cita:</b>
                                            {{ item.observacion_agenda }}
                                        </p>
                                        <p>
                                            <span v-if="item.estado_id === 30">
                                                <b style="color: black">Motivo de cancelación:</b> ({{
                                                    item?.motivo_cancelacion
                                                }})
                                            </span>
                                        </p>
                                        <v-divider></v-divider>
                                    </v-list-item-subtitle>
                                    <!-- <v-list-item-subtitle v-for="(item, i) in consultasFiltradasObser" :key="i">
                                      Observacion:  {{ item.observacion_agenda }}
                                    </v-list-item-subtitle> -->
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                    </v-row>

                    <v-row dense v-if="accion">
                        <v-container fluid>
                            <div class="d-flex align-center mb-3 pl-4">
                                <v-icon class="mr-1">mdi-calendar-alert</v-icon>
                                <span>
                                    Proceso de <b>{{ accion }}</b> de agenda
                                </span>
                            </div>

                            <v-form>
                                <v-col cols="12">
                                    <v-textarea outlined counter :rules="[rules.length(10)]" clearable
                                        v-model="cambioAgenda.motivo" label="Motivo" dense auto-grow
                                        hint="Motivo por el cual se ha de alterar la agenda seleccionada" />
                                </v-col>

                                <v-card-actions>
                                    <v-col cols="12" sm="8" md="8" v-if="accion === 'Eliminación bloque'">
                                        <v-alert dense text border="left" type="warning">
                                            Sólo se han de eliminar del bloque las agendas
                                            <b>DISPONIBLES</b> o <b>BLOQUEADAS</b> del día seleccionado
                                        </v-alert>
                                    </v-col>

                                    <v-col cols="12" sm="8" md="8" v-if="accion === 'Bloqueo bloque'">
                                        <v-alert dense text border="left" type="warning">
                                            Sólo se han de bloquear del calendario las agendas en estado
                                            <b>DISPONIBLES</b> del día seleccionado
                                        </v-alert>
                                    </v-col>

                                    <v-spacer></v-spacer>

                                    <v-btn color="red" dark small @click="cerrarModal()">Cancelar</v-btn>
                                    <v-btn color="success" dark small @click="guardarCambio(agenda.id)">Guardar</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-container>
                    </v-row>

                    <v-card-actions :key="agenda?.id">
                        <!-- Bloquear individual -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-if="agenda?.estado_id == 11" icon color="#90A4AE" v-bind="attrs" v-on="on"
                                    @click="setAccion('bloquear')">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                            </template>
                            <span>Bloquear individual</span>
                        </v-tooltip>

                        <!-- Bloquear bloque -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-if="agenda?.estado_id == 11" icon color="#455A64" v-bind="attrs" v-on="on"
                                    @click="setAccion('bloquearBloque')">
                                    <v-icon>mdi-close-circle-multiple</v-icon>
                                </v-btn>
                            </template>
                            <span>Bloquear bloque</span>
                        </v-tooltip>

                        <!-- Eliminar individual -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-if="agenda?.estado_id == 11 || agenda?.estado_id == 12" icon color="warning"
                                    v-bind="attrs" v-on="on" @click="setAccion('eliminar')">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar individual</span>
                        </v-tooltip>

                        <!-- Eliminar bloque -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-if="agenda?.estado_id == 11 || agenda?.estado_id == 12" icon color="red"
                                    v-bind="attrs" v-on="on" @click="setAccion('eliminarBloque')">
                                    <v-icon>mdi-delete-forever</v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar bloque</span>
                        </v-tooltip>

                        <!-- Desbloquear individual -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-if="agenda?.estado_id == 12" icon color="blue" v-bind="attrs" v-on="on"
                                    @click="setAccion('desbloquear')">
                                    <v-icon>mdi-shield-lock-open</v-icon>
                                </v-btn>
                            </template>
                            <span>Desbloquear individual</span>
                        </v-tooltip>

                        <!-- Desbloquear bloque -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-if="agenda?.estado_id == 12" icon color="blue darken-3" v-bind="attrs"
                                    v-on="on" @click="setAccion('desbloquearBloque')">
                                    <v-icon>mdi-lock-open-variant</v-icon>
                                </v-btn>
                            </template>
                            <span>Desbloquear bloque</span>
                        </v-tooltip>

                        <!-- Histórico cambios -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="green" v-bind="attrs" v-on="on" @click="historicoCambios()">
                                    <v-icon>mdi-history</v-icon>
                                </v-btn>
                            </template>
                            <span>Histórico de cambios</span>
                        </v-tooltip>

                        <v-spacer></v-spacer>

                        <!-- Cerrar -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="error" v-bind="attrs" v-on="on" @click="selectedOpen = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </template>
                            <span>Cerrar</span>
                        </v-tooltip>
                    </v-card-actions>

                </v-card>
            </v-menu>
        </v-card>

        <v-dialog v-model="dialogoHistorico" persistent max-width="900px">
            <v-card>
                <v-card-title class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50" width="50" />
                        <span class="ml-3 text-h6 font-weight-medium">Histórico de cambios de la agenda</span>
                    </div>
                    <v-btn icon @click="dialogoHistorico = false">
                        <v-icon color="red">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                    <v-timeline dense>
                        <v-timeline-item v-for="cambio in cambios" :key="cambio.id" small color="blue-grey lighten-3">
                            <template v-slot:icon>
                                <v-avatar color="blue-grey darken-1">
                                    <v-icon color="white">mdi-clock-edit-outline</v-icon>
                                </v-avatar>
                            </template>

                            <v-card class="elevation-2">
                                <v-card-title class="py-2 px-3 d-flex justify-space-between align-center"
                                    style="background: #f5f5f5; margin-bottom: 4px;">
                                    <div>
                                        <v-icon small color="green">mdi-account-badge</v-icon>
                                        <span class="font-weight-medium">{{ cambio.usuario_cambia || '-' }}</span>
                                    </div>
                                    <div>
                                        <v-icon small color="green">mdi-calendar-clock</v-icon>
                                        <span class="caption grey--text">{{ cambio.fecha_accion || '-' }}</span>
                                    </div>
                                </v-card-title>

                                <v-card-subtitle class="py-3 px-3">
                                    <v-icon small color="blue">mdi-information-outline</v-icon>
                                    <span class="font-weight-bold">{{ cambio.accion }}</span>
                                </v-card-subtitle>

                                <v-card-text class="py-2 px-3">
                                    <div class="mb-2">{{ cambio.motivo || '-' }}</div>

                                    <div v-if="cambio.consultorio_origen_nombre || cambio.consultorio_destino_nombre"
                                        class="mt-1">
                                        <v-divider class="my-1"></v-divider>

                                        <div class="d-flex justify-space-between">
                                            <span class="grey--text text-caption font-weight-medium">Sede prestación
                                                origen:</span>
                                            <span>
                                                {{ cambio.consultorio_origen_nombre || '-' }}
                                                <span v-if="cambio.rep_origen_nombre"> ({{ cambio.rep_origen_nombre }} -
                                                    {{
                                                        cambio.rep_origen_codigo }})</span>
                                            </span>
                                        </div>

                                        <div class="d-flex justify-space-between mt-1">
                                            <span class="grey--text text-caption font-weight-medium">Sede prestación
                                                destino:</span>
                                            <span>
                                                {{ cambio.consultorio_destino_nombre || '-' }}
                                                <span v-if="cambio.rep_destino_nombre"> ({{ cambio.rep_destino_nombre }}
                                                    - {{
                                                        cambio.rep_destino_codigo }})</span>
                                            </span>
                                        </div>
                                    </div>
                                </v-card-text>

                            </v-card>
                        </v-timeline-item>
                    </v-timeline>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="red darken-1" dark @click="dialogoHistorico = false">
                        <v-icon left>mdi-close-circle</v-icon>
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalCambioCita" persistent width="700px">
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                <span>Actualización de cita de la agenda</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                    </v-toolbar>
                </v-card-title>

                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12">
                            <v-alert border="left" type="info" colored-border dense class="mb-3">
                                Solo se muestran las <b>citas de la especialidad de esta agenda</b> cuyo
                                <b>tiempo de consulta</b> puede ajustarse dentro del rango disponible entre
                                la <b>fecha y hora de inicio</b> (<i>{{ agenda?.fecha_inicio }}</i>) y la
                                <b>fecha y hora de fin</b> (<i>{{ agenda?.fecha_fin }}</i>).
                                Si una cita no aparece en la lista, significa que su duración excede
                                el tiempo disponible en la agenda.
                            </v-alert>
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete outlined :items="citas" item-value="id" item-text="nombre" dense
                                v-model="formCambioCita.cita_id" label="Nuevo tipo de cita" />
                        </v-col>
                    </v-row>
                </v-container>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="red" @click="modalCambioCita = false" dark>
                        Cerrar
                    </v-btn>
                    <v-btn small color="success" @click="cambiarCitaAgenda()">
                        Actualizar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
export default {
    name: "WorkspaceJsonRegistro",

    data() {
        return {
            accion: null,
            estados: [
                { label: "Disponible", color: "light-blue darken-4", icon: "mdi-calendar-check" },
                { label: "Bloqueada", color: "grey darken-1", icon: "mdi-lock" },
                { label: "Inasistencia", color: "red darken-2", icon: "mdi-account-cancel" },
                { label: "Asignada sin confirmar", color: "orange darken-2", icon: "mdi-calendar-clock" },
                { label: "Confirmada", color: "green darken-3", icon: "mdi-check-circle" },
                { label: "Confirmada por Whatsapp", color: "purple darken-3", icon: "mdi-whatsapp" },
                { label: "En consulta", color: "yellow darken-2", icon: "mdi-stethoscope" },
                { label: "Cita atendida", color: "light-blue accent-3", icon: "mdi-account-check" },
            ],
            agenda: null,
            modalCambioCita: false,
            citas: [],
            rules: {
                length: (len) => (v) =>
                    (v || "").length >= len ||
                    `Debes ingresar por lo menos ${len} caracteres`,
            },
            estadoColor: true,
            preload: false,
            medico: "",
            medicosActivos: [],
            cambios: [],
            dialogoHistorico: false,
            loading: false,
            form: {
                medico: null,
            },
            type: "month",
            types: ["month", "week", "day", "4day"],
            mode: "stack",
            modes: ["stack", "column"],
            weekday: [0, 1, 2, 3, 4, 5, 6],
            weekdays: [
                {
                    text: "Domingo - Sábado",
                    value: [0, 1, 2, 3, 4, 5, 6],
                },
                {
                    text: "Lunes - Sábado",
                    value: [1, 2, 3, 4, 5, 6, 0],
                },
                {
                    text: "Lunes - Viernes",
                    value: [1, 2, 3, 4, 5],
                },
                {
                    text: "Lunes, Miércoles, Viernes",
                    value: [1, 3, 5],
                },
            ],
            funcionario: null,
            value: "",
            focus: "",
            events: [],
            typeToLabel: {
                month: "Mes",
                week: "Semana",
                day: "Dia",
                "4day": "4 Dias",
            },
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            cambioAgenda: {
                user_id: "",
                agenda_id: "",
                accion: "",
                motivo: "",
            },
            fecha_inicial: "",
            fecha_final: "",
            fecha_inicio: "",
            fecha_fin: "",
            cambioCita: {
                especialidad_id: "",
            },
            formCambioCita: {
                cita_id: null,
                agenda_id: null,
            },
            timeout: null,
        };
    },

    watch: {
        focus(valor, antiguoValor) {
            const arrayActual = valor.split("-");
            const arrayAnterior = antiguoValor.split("-");

            if (
                arrayActual[0] != arrayAnterior[0] ||
                arrayActual[1] != arrayAnterior[1]
            ) {
                this.getAgenda();
            }
        },
    },

    mounted() {
        const fecha = new Date();
        this.fechaActual =
            fecha.getFullYear() +
            "-" +
            ("0" + (fecha.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + fecha.getDate()).slice(-2);

        if (!this.$can("agendamiento.buscar")) {
            this.medico = this.$store.state.auth.usuario.id;
            this.getAgenda();
        } else {
            this.funcionarios();
        }
    },

    computed: {
        consultasFiltradas() {
            if (this.agenda && Array.isArray(this.agenda.consultas)) {
                return this.agenda.consultas.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
            }
            return [];
        },
        consultasFiltradasObser() {
            if (this.agenda && Array.isArray(this.agenda.consultas)) {
                return this.agenda.consultas.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
            }
            return [];
        },
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        viewDay({ date }) {
            this.focus = date;
            this.type = "day";
        },
        getDay(date) {
            const WeekDays = [
                "Domingo",
                "Lunes",
                "Martes",
                "Miercoles",
                "Jueves",
                "Viernes",
                "Sabado",
            ];
            return WeekDays[date.weekday];
        },

        setAccion(tipo) {
            this.accion = tipo;
        },
        isAccion(tipo) {
            return this.accion === tipo;
        },

        async funcionarios() {
            this.loading = true;
            try {
                const response = await this.$axios.get("usuarios/operadores-activos");
                this.medicosActivos = response.data;
                this.loading = false;
            } catch (error) {
                this.loading = false;
                console.log(error);
            }
        },

        async consultarAgenda(agenda_id) {
            try {
                const response = await this.$axios.get("agenda/consultar/" + agenda_id);
                return response.data;
            } catch (error) {
                console.log(error);
            }
        },

        setToday() {
            this.focus = "";
        },

        prev() {
            this.$refs.calendar.prev();
        },

        next() {
            this.$refs.calendar.next();
        },

        async showEvent({ nativeEvent, event }) {
            try {
                this.setPreload(true);

                const agendaResult = await this.consultarAgenda(event.idAgenda);

                this.agenda = JSON.parse(JSON.stringify(agendaResult));
            } catch (error) {
                return;
            } finally {
                this.setPreload(false);
            }

            const open = () => {
                this.selectedEvent = { ...event };
                this.selectedElement = nativeEvent.target;

                requestAnimationFrame(() =>
                    requestAnimationFrame(() => (this.selectedOpen = true))
                );
            };

            if (this.selectedOpen) {
                this.selectedOpen = false;
                requestAnimationFrame(() => requestAnimationFrame(() => open()));
            } else {
                open();
            }

            nativeEvent.stopPropagation();
        },

        generarFecha() {
            let date = new Date();

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            if (month < 10) {
                return `${year}-0${month}-${day}`;
            } else {
                return `${year}-${month}-${day}`;
            }
        },

        async getAgenda() {
            try {
                this.arrayEvents = [];
                this.events = [];
                this.agendas = [];

                const fecha = this.focus || this.generarFecha();

                this.setPreload(true);
                const response = await this.$axios.get(
                    "/usuarios/agendaMedico/" + this.medico + "?fecha=" + fecha
                );
                response.data.forEach((agenda) => {
                    const found = this.arrayEvents.find(
                        (element) => element === agenda.fecha_inicio.substring(0, 10)
                    );
                    if (found === undefined) {
                        if (agenda.fecha_inicio.substring(0, 10) >= this.fechaActual) {
                            this.arrayEvents.push(agenda.fecha_inicio.substring(0, 10));
                        }
                    }
                    this.events.push({
                        color: "info",
                        estado: agenda.estado_id,
                        name: agenda.cita_nombre,
                        idAgenda: agenda.id,
                        start: agenda.fecha_inicio.substring(0, 16),
                        end: agenda.fecha_fin.substring(0, 16),
                        timed: true,
                        consulta: agenda.consultas,
                    });
                });
            } catch (error) {
                console.log(error);
            } finally {
                this.setPreload(false);
            }
        },

        agendaMedico() {
            this.arrayEvents = [];
            this.events = [];
            this.agendas = [];
            const fecha = this.focus || this.generarFecha();
            this.$axios
                .$get("/usuarios/agendaMedico/" + this.medico + "?fecha=" + fecha)
                .then((res) => {
                    this.agendas = res;

                    res.forEach((s) => {
                        const found = this.arrayEvents.find(
                            (element) => element === s.fecha_inicio.substring(0, 10)
                        );
                        if (found === undefined) {
                            if (s.fecha_inicio.substring(0, 10) >= this.fechaActual) {
                                this.arrayEvents.push(s.fecha_inicio.substring(0, 10));
                            }
                        }
                        this.events.push({
                            color: "info",
                            estado: s.estado_id,
                            name: s.cita_nombre,
                            idAgenda: s.id,
                            start: s.fecha_inicio.substring(0, 16),
                            end: s.fecha_fin.substring(0, 16),
                            timed: true,
                        });
                    });
                    this.preload = false;
                })
                .catch((e) => {
                    this.preload = false;
                });
        },

        cerrarModal() {
            this.cambioAgenda = {};
            this.accion = null;
        },

        guardarCambio(agenda_id) {
            if (!this.cambioAgenda.motivo) {
                this.$toast.error("Es necesario que especifique el motivo del bloqueo");
                return;
            }

            this.cambioAgenda = {
                ...this.cambioAgenda,
                accion: this.accion,
                user_id: this.$store.state.auth.usuario.id,
                agenda_id,
            };

            this.$axios
                .post("/cambio-agenda/crear", this.cambioAgenda)
                .then(() => {
                    this.$toast.success("Se ha actualizado la agenda correctamente");
                    this.getAgenda();
                    this.selectedOpen = false;
                    this.cerrarModal();
                })
                .catch(() => {
                    this.$toast.error("Ha ocurrido un error durante la actualización");
                });
        },

        historicoCambios() {
            this.dialogoHistorico = true;
            this.$axios
                .get("/cambio-agenda/" + this.agenda.id)
                .then((res) => {
                    this.cambios = res.data;
                })
                .catch((e) => {
                    console.log(e.response.data);
                });
        },

        getEventColor(event) {
            let estadoId = parseInt(event.estado);

            if (event.consulta && event.consulta.length > 0) {
                const tieneEstado14 = event.consulta.some(c => c.estado_id === 14);
                if (tieneEstado14) {
                    estadoId = 6;
                } else {
                    const tieneEstado9 = event.consulta.some(c => c.estado_id === 9);
                    const tieneEstado59 = event.consulta.some(c => c.estado_id === 59);
                    const tieneEstado67 = event.consulta.some(c => c.estado_id === 67);

                    if (tieneEstado9) {
                        estadoId = 9;
                    } else if (tieneEstado59) {
                        estadoId = 59;
                    } else if (tieneEstado67) {
                        estadoId = 67;
                    } else {
                        const haCancelado = event.consulta.some(c => c.estado_id === 13);
                        if (haCancelado) {
                            estadoId = 13;
                        }
                    }
                }
            }

            switch (estadoId) {
                case 11:
                    event.color = "light-blue darken-4";
                    break;
                case 9:
                    event.color = "light-blue lighten-1";
                    break;
                case 12:
                    event.color = "grey darken-1";
                    break;
                case 8:
                    event.color = "red darken-2";
                    break;
                case 6:
                case 14:
                case 59:
                    event.color = "green darken-3";
                    break;
                case 13:
                    event.color = "orange darken-2";
                    break;
                case 67:
                    event.color = "purple darken-3";
                    break;
                case 7:
                    event.color = "yellow darken-2";
                    break;
                default:
                    event.color = "light-blue darken-4";
                    break;
            }

            return event.color;
        },

        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a;
        },

        actualizarCita() {
            this.modalCambioCita = true;
            this.cambioCita.especialidad_id = this.agenda.cita.especialidad.id;
            let especialidad_id = this.cambioCita.especialidad_id;
            this.listarCitas(especialidad_id);
        },

        listarCitas(especialidad_id) {
            this.$axios
                .post("citas/consultarPorEspecialidadTodas", {
                    data: especialidad_id,
                    estado: 1,
                })
                .then((res) => {
                    const fechaInicio = moment(this.agenda.fecha_inicio, "YYYY-MM-DD HH:mm:ss.SSS");
                    const fechaFin = moment(this.agenda.fecha_fin, "YYYY-MM-DD HH:mm:ss.SSS");

                    const duracionDisponible = fechaFin.diff(fechaInicio, "minutes");

                    this.citas = res.data.filter(cita => {
                        const tiempoConsulta = parseInt(cita.tiempo_consulta, 10) || 0;
                        return tiempoConsulta <= duracionDisponible;
                    });

                })
                .catch((err) => {
                    this.$toast.error("No se han podido cargar las citas de la especialidad");
                });
        },

        cambiarCitaAgenda() {
            this.formCambioCita.agenda_id = this.agenda.id;
            this.$axios
                .post("agenda/actualizarCita", this.formCambioCita)
                .then((res) => {
                    this.$toast.success(
                        "Se ha actualizado la cita de la agenda correctamente!."
                    );
                    this.modalCambioCita = false;
                    this.getAgenda();
                })
                .catch((error) => {
                    this.toast.error("Error al intentar actualizar la cita de la agenda");
                });
        },
    },
};
</script>
