export async function sha256(message: any) {
    // Encode the message as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);
  
    // Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
    // Convert the ArrayBuffer to an array of bytes
    const hashArray = Array.from(new Uint8Array(hashBuffer));
  
    // Convert the bytes to a hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  
    console.log(hashHex); // Print the hash value (optional)
    return hashHex;
}