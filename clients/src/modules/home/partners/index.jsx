import { A, Img } from '../../../components/html-tags'

export default () => {
  return (
    <A
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 1,
        opacity: 0.8,
        backgroundColor: theme => theme.palette.common.white,
        p: 1,
      }}
      target="_blank"
      href="https://www.dst.gov.za/"
    >
      <Img
        sx={{
          maxHeight: theme => theme.spacing(8),
          width: 'auto',
          display: 'block',
          marginLeft: 'auto',
        }}
        src="/dsi.png"
        alt="Department of Science and Technology logo"
      />
    </A>
  )
}
