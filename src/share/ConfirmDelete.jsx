import Swal from 'sweetalert2'

const ConfirmDelete = (nameItem, idItem, callApiFn) => {
 return Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
 }).then((result) => {
  if (result.isConfirmed) {
   callApiFn(idItem)

   Swal.fire({
    title: 'Deleted!',
    text: `Your ${nameItem} has been deleted.`,
    icon: 'success',
   })
  }
 })
}

export default ConfirmDelete
