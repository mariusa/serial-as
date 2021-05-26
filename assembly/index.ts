import { u128 } from "near-sdk-as";

function isNull<T>(t: T): bool {
  if (isNullable<T>() || isReference<T>()) {
    return changetype<usize>(t) == 0;
  }
  return false;
}

export abstract class Encoder<R>{

  constructor(){}

  abstract encode_field<T>(name:string, value:T):void
  abstract get_encoded_object():R

  // Boolean
  abstract encode_bool(value: bool): void

  // Map --
  abstract encode_map<K, V>(value:Map<K, V>): void

  // Null --
  abstract encode_null(): void

  // Object --
  abstract encode_object<C>(value:C): void

  // String --
  abstract encode_string(value:string): void

  // Set --
  abstract encode_set<S>(value:Set<S>): void

  // Number --
  abstract encode_u8(value:u8): void
  abstract encode_i8(value:i8): void
  abstract encode_u16(value:u16): void
  abstract encode_i16(value:i16): void
  abstract encode_u32(value:u32): void
  abstract encode_i32(value:i32): void
  abstract encode_u64(value:u64): void
  abstract encode_i64(value:i64): void
  abstract encode_u128(value:u128): void
  abstract encode_f32(value:f32): void
  abstract encode_f64(value:f64): void

  encode_number<N extends number>(value:N):void{
    // @ts-ignore
    if (value instanceof u8){ this.encode_u8(value); return }
    // @ts-ignore
    if (value instanceof i8){ this.encode_i8(value); return }
    // @ts-ignore
    if (value instanceof u16){ this.encode_u16(value); return }
    // @ts-ignore
    if (value instanceof i16){ this.encode_i16(value); return }
    // @ts-ignore
    if (value instanceof u32){ this.encode_u32(value); return }
    // @ts-ignore
    if (value instanceof i32){ this.encode_i32(value); return }
    // @ts-ignore
    if (value instanceof u64){ this.encode_u64(value); return }
    // @ts-ignore
    if (value instanceof i64){ this.encode_i64(value); return }
    // @ts-ignore
    if (value instanceof f32){ this.encode_f32(value); return }
    // @ts-ignore
    if (value instanceof f64){ this.encode_f64(value); return }
  }

  // Array --
  abstract encode_array<A>(value:Array<A>): void
  abstract encode_u8array(value:Uint8Array): void
  abstract encode_i8array(value:Int8Array): void
  abstract encode_u16array(value:Uint16Array): void
  abstract encode_i16array(value:Int16Array): void
  abstract encode_u32array(value:Uint32Array): void
  abstract encode_i32array(value:Int32Array): void
  abstract encode_u64array(value:Uint64Array): void
  abstract encode_i64array(value:Int64Array): void

  encode_array_like<T>(value:T): void{
    // @ts-ignore
    if (value instanceof Uint8Array){ this.encode_u8array(value); return }
    // @ts-ignore
    if (value instanceof Uint16Array){ this.encode_u16array(value); return }
    // @ts-ignore
    if (value instanceof Uint32Array){ this.encode_u32array(value); return }
    // @ts-ignore
    if (value instanceof Uint64Array){ this.encode_u64array(value); return }
    // @ts-ignore
    if (value instanceof Int8Array){ this.encode_i8array(value); return }
    // @ts-ignore
    if (value instanceof Int16Array){ this.encode_i16array(value); return }
    // @ts-ignore
    if (value instanceof Int32Array){ this.encode_i32array(value); return }
    // @ts-ignore
    if (value instanceof Int64Array){ this.encode_i64array(value); return }

    // @ts-ignore
    this.encode_array<valueof<T>>(value);
  }


  // Encode --
  encode<V>(value: V): void {
    // This function encodes a value:V into the encoder.encoded_object:R

    // @ts-ignore
    if (isBoolean<V>()){ this.encode_bool(value); return }

    // @ts-ignore
    if (isInteger<V>() || isFloat<V>()){ this.encode_number<V>(value); return }

    // @ts-ignore
    if (isString<V>()) { this.encode_string(value); return }

    if (isNull<V>(value)){ this.encode_null(); return }
    
    // @ts-ignore
    if (isDefined(value.encode)){ this.encode_object(value); return }

    if (isArrayLike<V>(value)){ this.encode_array_like<V>(value); return }

    // @ts-ignore
    if (value instanceof u128){ this.encode_u128(value); return }

    // @ts-ignore
    if(value instanceof Set){ this.encode_set<valueof<V>>(value); return }

    // @ts-ignore
    if(value instanceof Map){ this.encode_map<indexof<V>, valueof<V>>(value)}
  }
}