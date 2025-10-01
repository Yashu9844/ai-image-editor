"use server"
import { headers } from 'next/headers'
import {auth} from '~/lib/auth' // path to your auth file
import { db } from '~/server/db' // path to your database file

export async function getUserCredits(){

    const session = await auth.api.getSession({
        headers:await headers()

    })

    if(!session?.user){
        return null;
    }

    const user = await db.user.findUniqueOrThrow({
        where:{
            id: session.user.id,
            

        },
        select:{
            credits: true,
            id: true,}
    }) 


    return user.credits;
}