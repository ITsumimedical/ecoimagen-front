<template>
	<div>
		<!-- Título de la tarjeta que contiene los controles de la interfaz -->
		<v-card-title>
			<!-- Botón para descargar contratos -->
			<v-btn color="success" small @click="descargarContratos">
				Descargar Contratos
			</v-btn>

			<!-- Espaciador para separar el botón de descarga del grupo de búsqueda -->
			<v-spacer></v-spacer>

			<!-- Grupo de búsqueda: contiene un campo de texto y botones para buscar y limpiar -->
			<v-row align="center">
				<!-- Columna para el campo de búsqueda -->
				<v-col cols="9" ls="3">
					<v-text-field v-model="search.nit" append-icon="mdi-search"
						label="Buscar contrato (por NIT o código de habilitación)" hide-details dense outlined />
				</v-col>
				<!-- Columna para los botones de buscar y limpiar -->
				<v-col cols="3" ls="3">
					<v-btn color="primary" small @click="getContratos">
						Buscar
					</v-btn>
					<v-btn color="error" small @click="limpiarBusqueda">
						Limpiar
					</v-btn>
				</v-col>
			</v-row>
		</v-card-title>

		<!-- Tabla de datos para mostrar los contratos -->
		<v-data-table :headers="headers" :items="contratos" class="elevation-1 mt-4 text-center"
			loading-text="cargando..." hide-default-footer disable-pagination no-data-text="Sin datos para mostrar"
			dense>

			<!-- Formateo personalizado para la columna 'codigo_contrato' -->
			<template v-slot:[`item.codigo_contrato`]="{ item }">
				<div class="text-no-wrap">
					<!-- Muestra el código del contrato o un mensaje si no existe -->
					{{ item.codigo_contrato ? item.codigo_contrato : 'Sin Codigo Contrato' }}
				</div>
			</template>

			<!-- Muestra el nombre de la modalidad de pago -->
			<template v-slot:[`item.modalidad_pago`]="{ item }">
				{{ item.modalidad_pago ? buscarModalidad(item.modalidad_pago) : 'Sin Modalidad' }}
			</template>

			<!-- Formateo de la fecha de inicio -->
			<template v-slot:[`item.fecha_inicio`]="{ item }">
				{{ $moment(item.fecha_inicio).format('DD/MM/YYYY') }}
			</template>

			<!-- Formateo de la fecha de término -->
			<template v-slot:[`item.fecha_termina`]="{ item }">
				{{ $moment(item.fecha_termina).format('DD/MM/YYYY') }}
			</template>

			<!-- Formateo del valor del contrato -->
			<template v-slot:[`item.valor_contrato`]="{ item }">
				{{ item.valor_contrato ? formatCurrency(item.valor_contrato) : formatCurrency(0) }}
			</template>
		</v-data-table>

		<!-- Fila para la paginación y selección de cantidad de elementos por página -->
		<v-row no-gutters>
			<!-- Columna para la paginación -->
			<v-col md="9" lg="9" xl="11" sm="11" class="px-2">
				<v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="getContratos()">
				</v-pagination>
			</v-col>
			<!-- Columna para el selector de cantidad de elementos por página -->
			<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
				<v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
					@change="getContratos()">
				</v-select>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mapActions } from 'vuex'; // Importa mapActions de Vuex para mapear acciones

export default {
	data() {
		return {
			// Objeto de búsqueda que contiene el NIT o código de habilitación
			search: {
				nit: null,
			},
			// Definición de las columnas de la tabla de datos
			headers: [
				{ text: 'Id', value: 'id', align: 'center',  sortable: false },
				{ text: 'Entidad', value: 'entidad.nombre', align: 'center',  sortable: false },
				{ text: 'Departamento', value: 'prestador.municipio.departamento.nombre', align: 'center',  sortable: false },
				{ text: 'Municipio', value: 'prestador.municipio.nombre', align: 'center',  sortable: false },
				{ text: 'Código de habilitación', value: 'prestador.codigo_habilitacion', align: 'center',  sortable: false },
				{ text: 'Documento', value: 'prestador.nit', align: 'center',  sortable: false },
				{ text: 'Prestador', value: 'prestador.nombre_prestador', align: 'center',  sortable: false },
				{ text: 'Número contrato', value: 'codigo_contrato', align: 'center',  sortable: false },
				{ text: 'Fecha inicial', value: 'fecha_inicio', align: 'center',  sortable: false },
				{ text: 'Fecha termina', value: 'fecha_termina', align: 'center',  sortable: false },
				{ text: 'N° afiliados', value: 'poblacion_cubierta', align: 'center',  sortable: false},
				{ text: 'Modalidad', value: 'modalidad_pago', align: 'center',  sortable: false},
				{ text: 'Valor contrato', value: 'valor_contrato', align: 'center',  sortable: false},
			],
			// Lista de modalidades de pago disponibles
			modalidades_pagos: [
				{ id: 1, nombre: 'Pago por evento' },
				{ id: 2, nombre: 'Pago por capitación' },
				{ id: 7, nombre: 'Pago individual por caso, conjunto integral de atenciones, paquete o canasta' },
				{ id: 8, nombre: 'Pago global prospectivo' },
				{ id: 6, nombre: 'Otro' },
			],
			contratos: [], // Array que almacenará los contratos obtenidos
			opciones: [15, 20, 50, 100], // Opciones para la cantidad de elementos por página
			opcionActual: 15, // Opción seleccionada actualmente
			pagina: 1, // Página actual
			total: 0, // Número total de páginas
		};
	},

	mounted() {
		this.getContratos(); // Obtiene los contratos al montar el componente
	},

	methods: {
		// Mapea la acción 'setPreload' del módulo 'app' en Vuex
		...mapActions('app', ['setPreload']),

		/**
		 * Obtiene todos los contratos desde la API.
		 * Realiza una petición POST con los parámetros de página y cantidad,
		 * además de los criterios de búsqueda.
		 */
		async getContratos() {
			this.setPreload(true); // Activa el indicador de carga
			await this.$axios
				.post(
					`/contrato/allContrato?page=${this.pagina}&cant=${this.opcionActual}`,
					this.search
				)
				.then((res) => {
					this.contratos = res.data.data; // Asigna los contratos obtenidos al array
					this.total = res.data.last_page; // Asigna el número total de páginas
				})
				.catch((error) => {
					// Muestra una notificación de error al usuario
					this.$toast.error('Error al cargar los contratos');
				})
				.finally(() => {
					this.setPreload(false); // Desactiva el indicador de carga
				});
		},

		/**
		 * Busca el nombre de la modalidad de pago según su ID.
		 * @param {Number} id - ID de la modalidad de pago
		 * @returns {String} Nombre de la modalidad o cadena vacía si no se encuentra
		 */
		buscarModalidad(id) {
			return (
				this.modalidades_pagos.find((modalidad) => modalidad.id === id)?.nombre ||
				''
			);
		},

		/**
		 * Descarga los contratos en formato Excel.
		 * Realiza una petición POST y maneja la descarga del archivo.
		 */
		descargarContratos() {
			this.setPreload(true); // Activa el indicador de carga
			this.$axios({
				method: 'post',
				url: 'contrato/descargar-contratos',
				responseType: 'blob', // Tipo de respuesta para manejar archivos binarios
			})
				.then((res) => {
					this.setPreload(false); // Desactiva el indicador de carga
					// Crea un objeto Blob a partir de la respuesta
					let blob = new Blob([res.data], {
						type:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
					});
					// Crea una URL para el Blob
					let url = window.URL.createObjectURL(blob);
					// Crea un elemento 'a' para simular la descarga
					let a = document.createElement('a');

					a.download = 'contratos.xlsx'; // Nombre del archivo a descargar
					a.href = url; // Asigna la URL al enlace
					document.body.appendChild(a); // Añade el enlace al DOM
					a.click(); // Simula un clic en el enlace para iniciar la descarga
					document.body.removeChild(a); // Remueve el enlace del DOM
					this.$toast.success('Se descargó correctamente'); // Notificación de éxito
				})
				.catch((err) => {
					this.setPreload(false); // Desactiva el indicador de carga
					this.$toast.error('Error en descargar informe'); // Notificación de error
				});
		},

		/**
		 * Limpia los criterios de búsqueda y vuelve a obtener los contratos.
		 */
		limpiarBusqueda() {
			this.search.nit = null; // Resetea el campo de búsqueda
			this.getContratos(); // Vuelve a obtener los contratos sin filtros
		},

		/**
		 * Formatea un valor numérico como moneda.
		 * @param {Number} value - Valor a formatear
		 * @returns {String} Valor formateado en moneda
		 */
		formatCurrency(value) {
			if (value !== null && value !== undefined) {
				// Utiliza Intl.NumberFormat para formatear el número según la localización
				return (
					'$' +
					new Intl.NumberFormat('es-CO', {
						minimumFractionDigits: 0,
					}).format(value)
				);
			} else {
				return '';
			}
		},
	},
};
</script>
