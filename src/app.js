import compression from "compression"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"

import notFoundMiddleware from "./middlewares/errors/not-found.middleware.js"
import errorMiddleware from "./middlewares/errors/error.middleware.js"
import mainRouter from "./routes/mainRouter.route.js"

const app = express()

//third party
app.use(helmet())
app.use(morgan("dev"))
app.use(compression())

//use express
app.use(express.json())

//router
app.use(mainRouter)

//not-found middlewares
app.use(notFoundMiddleware)

//error middlewares
app.use(errorMiddleware)

export default app