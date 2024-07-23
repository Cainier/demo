/**
 * 等待
 * @param time 等待时间 ms
 */
export async function wait (time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}
